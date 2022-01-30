import { BACKGROUND_COLOR, BACKGROUND_RBG } from '../../constants';

const { r, g, b } = BACKGROUND_RBG;

export class PhaserSplash extends Phaser.Scene {
    constructor() {
        super({
            key: 'PhaserSplash'
        });
    }
    preload() {
        this.cameras.main.setBackgroundColor(BACKGROUND_COLOR);
    }
    create() {
        let bg = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'phaser').setOrigin(0.5, 0.5);
        this.cameras.main.fadeIn(1250, r, g, b);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, () => {
            setTimeout(() => {
                this.cameras.main.fadeOut(1250, r, g, b);
            }, 1750);
        });
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            setTimeout(() => {
                this.scene.start('MainMenu');
            }, 500);
        });
    }
}
