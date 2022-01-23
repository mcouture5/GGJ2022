import { Scene, Game } from 'phaser';
import { DISPLAY_SIZE } from '../constants';

export class GameScene extends Phaser.Scene {

    private sky: Phaser.GameObjects.Sprite;
    private mountains: Phaser.GameObjects.TileSprite;
    private hills: Phaser.GameObjects.TileSprite;
    private grass: Phaser.GameObjects.TileSprite;
    private dayOverlay: Phaser.GameObjects.Sprite;
    private nightOverlay: Phaser.GameObjects.Sprite;

    constructor() {
        super({
            key: 'GameScene'
        });
    }

    init(config): void {
        
    }

    create(): void {
        this.sky = this.add.sprite(DISPLAY_SIZE.width / 2, DISPLAY_SIZE.height / 2, 'sky').setOrigin(0.5, 0.5);
        this.mountains = this.add.tileSprite(DISPLAY_SIZE.width / 2, DISPLAY_SIZE.height / 2, DISPLAY_SIZE.width, DISPLAY_SIZE.height, 'mountains');
        this.hills = this.add.tileSprite(DISPLAY_SIZE.width / 2, DISPLAY_SIZE.height / 2, DISPLAY_SIZE.width, DISPLAY_SIZE.height, 'hills');
        this.grass = this.add.tileSprite(DISPLAY_SIZE.width / 2, DISPLAY_SIZE.height / 2, DISPLAY_SIZE.width, DISPLAY_SIZE.height, 'grass');
        this.dayOverlay = this.add.sprite(DISPLAY_SIZE.width / 2, DISPLAY_SIZE.height / 2, 'dayoverlay').setOrigin(0.5, 0.5);
        //this.nightOverlay = this.add.sprite(DISPLAY_SIZE.width / 2, DISPLAY_SIZE.height / 2, 'nightoverlay').setOrigin(0.5, 0.5);
    }

    update(): void {
        this.mountains.tilePositionX -= 0.35;
        this.hills.tilePositionX -= 1.75;
        this.grass.tilePositionX -= 3.75;
    }
}
