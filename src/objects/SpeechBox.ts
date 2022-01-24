import { BACKGROUND_COLOR, BACKGROUND_HEX_COLOR, DISPLAY_SIZE } from '../constants';

export class SpeechBox extends Phaser.GameObjects.Group {
    private bubble: Phaser.GameObjects.Shape;
    private text: Phaser.GameObjects.Text;
    private speech: string;
    private boxWidth: number;
    private boxHeight: number;
    private timer: Phaser.Time.TimerEvent;
    private spaceTween: Phaser.Tweens.Tween;
    private speaking: boolean;
    private waitForSpace: boolean;
    private minitb: Phaser.GameObjects.Sprite;

    constructor(params: { scene: Phaser.Scene; minitb: Phaser.GameObjects.Sprite }) {
        super(params.scene);
        this.minitb = params.minitb;
        this.boxWidth = 1024;
        this.boxHeight = 768;
        this.bubble = this.scene.add.rectangle(0, 0, this.boxWidth, 0, BACKGROUND_HEX_COLOR).setStrokeStyle(0x000000, 1).setDepth(300).setOrigin(0, 0);
        this.text = this.scene.add
            .text(0, 0, '', {
                fontFamily: 'Octanis',
                fontSize: '3rem',
                color: '#000000',
                wordWrap: { width: this.boxWidth - 10, useAdvancedWrap: true }
            })
            .setDepth(310)
            .setAlpha(0);
        this.waitForSpace = true;
    }

    update() {
        if (this.speaking && !this.waitForSpace) {
            // If still talking, just finish talking
            let currentlyPrinted = this.text.text;
            if (currentlyPrinted.length < this.speech.length) {
                this.timer && this.timer.destroy();
                this.text.setText(this.speech);
            } else {
                this.scene.events.emit('advance');
                this.speaking = false;
            }
        }
    }

    move(x: number, y: number) {
        this.bubble.setX(x).setY(y);
        this.text
            .setX(x + 10)
            .setY(y + 10)
            .setText('');
    }

    speak(speech: string) {
        this.speech = speech;
        this.bubble.setAlpha(1);
        this.scene.tweens.add({
            targets: [this.bubble],
            height: this.boxHeight,
            duration: 550,
            onComplete: () => {
                this.text.setText('').setAlpha(1).setSize(200, 200);
                if (this.waitForSpace) {
                    this.animateSpace();
                }
                this.printText();
            }
        });
    }

    shutup() {
        this.spaceTween && this.spaceTween.stop();
        this.text.setAlpha(0);
        this.scene.tweens.add({
            targets: [this.bubble],
            height: 0,
            duration: 200,
            onComplete: () => {
                this.bubble.setAlpha(0);
            }
        });
    }

    setWaitForSpace(value) {
        this.waitForSpace = value;
    }

    private animateSpace() {}

    private printText() {
        this.speaking = true;
        let currentlyPrinted = this.text.text;
        if (currentlyPrinted.length < this.speech.length) {
            let portion = this.speech.substr(0, this.speech.length - (this.speech.length - currentlyPrinted.length) + 1);
            this.text.setText(portion);
            this.timer = this.scene.time.addEvent({
                callback: this.printText,
                callbackScope: this,
                delay: 15,
                repeat: 0
            });
        }
    }
}
