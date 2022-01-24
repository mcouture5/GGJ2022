import { BACKGROUND_RBG, DISPLAY_SIZE } from '../constants';
import { SpeechBox } from '../objects/SpeechBox';
import { MusicTracks, MusicUtils } from '../MusicTracks';

const { r, g, b } = BACKGROUND_RBG;

interface CharacterCreationConfig {
    // music tracks from main menu. null if not coming from main menu.
    mainMenuMusic?: MusicTracks;
}

export class CharacterCreation extends Phaser.Scene {
    private introducingCreator: boolean = false;
    private overlay: Phaser.GameObjects.Rectangle;
    private recordManager: Phaser.GameObjects.Sprite;
    private speechBox: SpeechBox;
    private mainMenuMusic: MusicTracks;

    constructor() {
        super({
            key: 'CharacterCreation'
        });
    }

    init(config: CharacterCreationConfig): void {
        this.mainMenuMusic = config.mainMenuMusic;
    }

    create() {
        let bg = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'character_creation').setOrigin(0.5, 0.5);
        bg.displayWidth = DISPLAY_SIZE.width;
        bg.displayHeight = DISPLAY_SIZE.height;

        this.overlay = this.add.rectangle(0, 0, DISPLAY_SIZE.width, DISPLAY_SIZE.height, 0x000000, 0.65).setOrigin(0, 0).setAlpha(0).setDepth(50);

        this.recordManager = this.add.sprite(450, -DISPLAY_SIZE.height, 'manager', 0).setOrigin(0.5, 0.5).setDepth(300);
        this.speechBox = new SpeechBox({ scene: this, minitb: this.recordManager });

        setTimeout(() => {
            this.tweens.add({
                targets: this.overlay,
                alpha: { from: 0, to: 1 },
                delay: 0,
                duration: 500,
                onComplete: (tween, targets, param) => {
                    this.introduceCreation();
                }
            });
        }, 1500);
    }

    private introduceCreation() {
        let timeline = this.tweens.createTimeline();
        timeline.add({
            targets: this.recordManager,
            y: { from: DISPLAY_SIZE.height + 210, to: DISPLAY_SIZE.height + 40 },
            duration: 1500
        });
        timeline.add({
            targets: this.recordManager,
            alpha: 1,
            duration: 500
        });
        timeline.add({
            targets: this.recordManager,
            scaleX: -1,
            duration: 1
        });
        timeline.add({
            targets: this.recordManager,
            alpha: 1,
            duration: 500
        });
        timeline.add({
            targets: this.recordManager,
            scaleX: 1,
            duration: 1
        });
        timeline.add({
            targets: this.recordManager,
            alpha: 1,
            duration: 500
        });
        timeline.add({
            targets: this.recordManager,
            y: DISPLAY_SIZE.height - 190,
            duration: 500
        });
        timeline.on('complete', () => {
            this.speechBox.move(700, 80);
            this.speechBox.speak("Oh hi! Didn't see you there...");

            let buttonContainer = this.add.container(250, 440);
            let startButton = new Phaser.GameObjects.Rectangle(this.scene.scene, 0, 0, 207, 105, 0xffffff, 1);
            startButton.setInteractive({ useHandCursor: true });
            startButton.on('pointerup', () => {
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                    this.scene.start('GameScene', { mainMenuMusic: this.mainMenuMusic });
                });
                this.cameras.main.fadeOut(350, r, g, b);
            });
            let startText = new Phaser.GameObjects.Text(this.scene.scene, 0, 0, 'Start', {
                fontFamily: 'Ace',
                fontSize: '6rem',
                color: '#000'
            }).setOrigin(0.5, 0.5);
            buttonContainer.add([startButton, startText]);
        });
        timeline.play();
    }

    private introduction() {}

    update() {
        this.speechBox.update();
    }
}
