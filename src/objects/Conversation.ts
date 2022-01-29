import { BACKGROUND_HEX_COLOR } from '../constants';
import Button, { BUTTON_CLICKED } from './Button';
import { SpeechButton } from './SpeechButton';

interface IConversationObject {
    text: string;
    choices?: Choice[];
    to?: string;
}

export interface Choice {
    text: string;
    to: string;
    data?: any;
}

export const RESPONSE = 'conversation_response';
export const CONVERSATION_COMPLETE = 'conversation_complete';
const BASE_BUTTON_Y = 600;

/**
 * Use this class to begin a conversation. Just pass it the conversation key and it will take care of the rest.
 *
 * Conversations must have:
 *
 */
export default class Conversation extends Phaser.GameObjects.Container implements IConversation {
    private conversation: { [key: string]: IConversationObject };
    private speaker: string;
    private activeConvo: IConversationObject;

    private bubble: Phaser.GameObjects.Shape;
    private speakerTitle: Phaser.GameObjects.Text;
    private text: Phaser.GameObjects.Text;
    private speech: string;
    private boxWidth: number;
    private boxHeight: number;
    private timer: Phaser.Time.TimerEvent;
    private responseButtons: SpeechButton[];
    private nextButton: Button;

    constructor(scene: Phaser.Scene, key: string, speaker?: string) {
        super(scene);
        this.conversation = this.scene.cache.json.get(key).conversation;
        this.speaker = speaker || this.scene.cache.json.get(key).speaker;
        this.boxWidth = 1024;
        this.boxHeight = 768;
        this.bubble = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, this.boxWidth, 0, BACKGROUND_HEX_COLOR).setStrokeStyle(0x000000, 2).setOrigin(0, 0);
        this.add(this.bubble);
        
        this.speakerTitle = new Phaser.GameObjects.Text(this.scene, 10, 10, this.speaker, {
            fontFamily: 'Octanis',
            fontSize: '3rem',
            color: '#000000'
        }).setAlpha(1);
        this.add(this.speakerTitle);
        this.text = new Phaser.GameObjects.Text(this.scene, 50, 80, '', {
            fontFamily: 'Octanis',
            fontSize: '2.5rem',
            color: '#666666',
            wordWrap: { width: this.boxWidth - 60, useAdvancedWrap: true }
        }).setAlpha(1);
        this.add(this.text);

        this.responseButtons = [];
        this.nextButton = new Button(this.scene, 'Next').setAlpha(0).setPosition(this.boxWidth - 75, this.boxHeight - 50);
        this.nextButton.on(BUTTON_CLICKED, () => {
            this.advanceConversation(this.activeConvo.to);
        });
        this.add(this.nextButton);
        this.setAlpha(0);
    }

    begin() {
        this.setAlpha(1);
        this.scene.tweens.add({
            targets: [this.bubble],
            height: this.boxHeight,
            duration: 550,
            onComplete: () => {
                this.advanceConversation('icebreaker');
            }
        });
    }

    /**
     * Pauses either to wait to say the next thing or for the player to make a choice.
     */
    private pauseConversation() {
        let choices = this.activeConvo.choices || [];
        if (choices.length) {
            this.showChoices();
        } else {
            this.waitThenSpeak();
        }
    }

    /**
     * Display the chocie buttons. This effectively waits for user input.
     */
    private showChoices() {
        this.nextButton.setAlpha(0);
        let choices = this.activeConvo.choices || [];
        let yPos = BASE_BUTTON_Y;
        for (let choice of choices) {
            let speechButton = new SpeechButton({
                scene: this.scene,
                data: choice,
                callback: (selection: Choice) => {
                    this.emit(RESPONSE, selection);
                    this.advanceConversation(selection.to);
                }
            });
            speechButton.setX(this.boxWidth / 2).setY(yPos);
            this.add(speechButton);
            this.responseButtons.push(speechButton);
            yPos += 100;
        }
    }

    private removeChoices() {
        for (let btn of this.responseButtons) {
            btn.destroy();
        }
        this.responseButtons = [];
    }

    /**
     * Waits a few seconds then proceeds to the next conversation topic.
     */
    private waitThenSpeak() {
        this.nextButton.setAlpha(1);
    }

    private advanceConversation(to: string) {
        this.text.setText('').setAlpha(1).setSize(200, 200);
        this.nextButton.setAlpha(0);
        this.activeConvo = this.conversation[to];
        // If no further conversation, close the box and destroy the evidence.
        if (this.activeConvo) {
            this.removeChoices();
            this.speech = this.activeConvo.text;
            this.printText();
        } else {
            this.shutup();
        }
    }

    private shutup() {
        this.text.setAlpha(0);
        this.nextButton.setAlpha(0);
        this.scene.tweens.add({
            targets: [this.bubble],
            height: 0,
            duration: 200,
            onComplete: () => {
                this.setAlpha(0);
                this.emit(CONVERSATION_COMPLETE);
                this.destroy();
            }
        });
    }

    private printText() {
        let currentlyPrinted = this.text.text;
        if (currentlyPrinted.length < this.speech.length) {
            let portion = this.speech.substr(0, this.speech.length - (this.speech.length - currentlyPrinted.length) + 1);
            this.text.setText(portion);
            this.scene.time.addEvent({
                callback: this.printText,
                callbackScope: this,
                delay: 15,
                repeat: 0
            });
        } else {
            this.pauseConversation();
        }
    }
}
