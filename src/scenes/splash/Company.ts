/**
 * Boot scene shows a loading bar while loading all assets.
 */
 export class Company extends Phaser.Scene {

    constructor() {
        super({
            key: 'Company'
        });
    }
    create() {
        setTimeout(() => {
            this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'company').setOrigin(0.5, 0.5);
            this.cameras.main.fadeIn(1250, 228, 228, 235);
        }, 500);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, () => {
            setTimeout(() => {
                this.cameras.main.fadeOut(1250, 228, 228, 235);
            }, 1750);
        });
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            setTimeout(() => {
                this.scene.start('PhaserSplash');
            }, 500);
        });
    }
}