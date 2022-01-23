/**
 * Boot scene shows a loading bar while loading all assets.
 */
 export class PhaserSplash extends Phaser.Scene {

    constructor() {
        super({
            key: 'PhaserSplash'
        });
    }
    create() {
        let bg = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'phaser').setOrigin(0.5, 0.5);
        this.cameras.main.fadeIn(1250, 228, 228, 235);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, () => {
            setTimeout(() => {
                this.cameras.main.fadeOut(1250, 228, 228, 235);
            }, 1750);
        });
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            setTimeout(() => {
                this.scene.start('MainMenu');
            }, 500);
        });
    }
}