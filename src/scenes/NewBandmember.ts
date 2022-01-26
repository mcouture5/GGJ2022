import {BACKGROUND_RBG, DISPLAY_SIZE} from '../constants';

export class NewBandmember extends Phaser.Scene {
    constructor() {
        super({
            key: 'NewBandmember'
        });
    }

    init(): void {}

    create(): void {
        let bg = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'office').setOrigin(0.5, 0.5);
        bg.displayWidth = DISPLAY_SIZE.width;
        bg.displayHeight = DISPLAY_SIZE.height;

        let buttonContainer = this.add.container(250, 440);
        let continueButton = new Phaser.GameObjects.Rectangle(this.scene.scene, 0, 0, 207, 105, 0xffffff, 1);
        continueButton.setInteractive({ useHandCursor: true });
        continueButton.on('pointerup', () => {
            // fade out camera
            this.cameras.main.fadeOut(350, BACKGROUND_RBG.r, BACKGROUND_RBG.g, BACKGROUND_RBG.b);
            // when camera fade is done...
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                // switch back to GameScene
                this.scene.start('GameScene');
            });
        });
        let startText = new Phaser.GameObjects.Text(this.scene.scene, 0, 0, 'Continue', {
            fontFamily: 'Ace',
            fontSize: '6rem',
            color: '#000'
        }).setOrigin(0.5, 0.5);
        buttonContainer.add([continueButton, startText]);
    }

    update(): void {}
}
