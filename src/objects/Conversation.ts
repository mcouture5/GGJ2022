import { BACKGROUND_HEX_COLOR } from '../constants';
import { SpeechButton } from './SpeechButton';

interface IConversationObject {
    text: string;
    choices?: Choice[];
    to?: string;
}

interface Choice {
    text: string;
    to: string;
}

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
    private activeConvo: IConversationObject;

    private bubble: Phaser.GameObjects.Shape;
    private text: Phaser.GameObjects.Text;
    private speech: string;
    private boxWidth: number;
    private boxHeight: number;
    private timer: Phaser.Time.TimerEvent;
    private responseButtons: SpeechButton[];

    constructor(scene: Phaser.Scene, key: string) {
        super(scene);
        this.conversation = this.scene.cache.json.get(key).conversation;
        this.boxWidth = 1024;
        this.boxHeight = 768;
        this.bubble = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, this.boxWidth, 0, BACKGROUND_HEX_COLOR).setStrokeStyle(0x000000, 1).setOrigin(0, 0);
        this.add(this.bubble);
        this.text = new Phaser.GameObjects.Text(this.scene, 10, 10, '', {
            fontFamily: 'Octanis',
            fontSize: '3rem',
            color: '#000000',
            wordWrap: { width: this.boxWidth - 10, useAdvancedWrap: true }
        }).setAlpha(0);
        this.add(this.text);
        this.responseButtons = [];
    }

    begin() {
        this.bubble.setAlpha(1);
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
        let choices = this.activeConvo.choices || [];
        let yPos = BASE_BUTTON_Y;
        for (let choice of choices) {
            let data = { text: choice.text, key: choice.to };
            let speechButton = new SpeechButton({
                scene: this.scene,
                data: data,
                callback: (to: string) => {
                    this.advanceConversation(to);
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
        setTimeout(() => {
            this.advanceConversation(this.activeConvo.to);
        }, 1000);
    }

    private advanceConversation(to: string) {
        this.text.setText('').setAlpha(1).setSize(200, 200);
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

    private move(x: number, y: number) {
        this.setX(x).setY(y);
    }

    private shutup() {
        this.text.setAlpha(0);
        this.scene.tweens.add({
            targets: [this.bubble],
            height: 0,
            duration: 200,
            onComplete: () => {
                this.bubble.setAlpha(0);
                this.scene.events.emit(CONVERSATION_COMPLETE);
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

Phaser.GameObjects.GameObjectFactory.register('conversation', function (this: Phaser.GameObjects.GameObjectFactory, key: string) {
    const conversation = new Conversation(this.scene, key);
    this.displayList.add(conversation);
    //this.updateList.add(conversation);
    return conversation;
});
