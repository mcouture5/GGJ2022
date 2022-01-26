import { DISPLAY_SIZE } from "../constants";

export class Gig extends Phaser.Scene {
    constructor() {
        super({
            key: 'Gig'
        });
    }

    init(): void {}

    create(): void {
        let bg = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'mainmenu').setOrigin(0.5, 0.5);
        bg.displayWidth = DISPLAY_SIZE.width;
        bg.displayHeight = DISPLAY_SIZE.height;
    }

    update(): void {}
}
