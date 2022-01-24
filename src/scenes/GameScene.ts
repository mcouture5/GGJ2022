import { Scene, Game } from 'phaser';
import { DISPLAY_SIZE } from '../constants';
import { MusicTracks } from "../MusicTracks";

// configuration object passed into init()
interface GameSceneConfig {
    // music tracks from main menu. null if not coming from main menu.
    mainMenuMusic?: MusicTracks;
}

export class GameScene extends Phaser.Scene {

    private sky: Phaser.GameObjects.Sprite;
    private mountains: Phaser.GameObjects.TileSprite;
    private hills: Phaser.GameObjects.TileSprite;
    private grass: Phaser.GameObjects.TileSprite;
    private dayOverlay: Phaser.GameObjects.Sprite;
    private nightOverlay: Phaser.GameObjects.Sprite;

    private mainMenuMusic: MusicTracks;
    private musicIsSetUp: boolean;
    private music: MusicTracks;

    constructor() {
        super({
            key: 'GameScene'
        });

        this.mainMenuMusic = null;
        this.musicIsSetUp = false;
        this.music = null;
    }

    init(config: GameSceneConfig): void {
        this.mainMenuMusic = config.mainMenuMusic;
    }

    create(): void {
        this.sky = this.add.sprite(DISPLAY_SIZE.width / 2, DISPLAY_SIZE.height / 2, 'sky').setOrigin(0.5, 0.5);
        this.mountains = this.add.tileSprite(DISPLAY_SIZE.width / 2, DISPLAY_SIZE.height / 2, DISPLAY_SIZE.width, DISPLAY_SIZE.height, 'mountains');
        this.hills = this.add.tileSprite(DISPLAY_SIZE.width / 2, DISPLAY_SIZE.height / 2, DISPLAY_SIZE.width, DISPLAY_SIZE.height, 'hills');
        this.grass = this.add.tileSprite(DISPLAY_SIZE.width / 2, DISPLAY_SIZE.height / 2, DISPLAY_SIZE.width, DISPLAY_SIZE.height, 'grass');
        this.dayOverlay = this.add.sprite(DISPLAY_SIZE.width / 2, DISPLAY_SIZE.height / 2, 'dayoverlay').setOrigin(0.5, 0.5);
        //this.nightOverlay = this.add.sprite(DISPLAY_SIZE.width / 2, DISPLAY_SIZE.height / 2, 'nightoverlay').setOrigin(0.5, 0.5);

        // do not pause sounds on blur
        this.sound.pauseOnBlur = false;
        // start playing music tracks if not already set up. fade it in.
        if (!this.musicIsSetUp) {
            this.musicIsSetUp = true;
            // fade out mainMenuMusic if we're coming from the main menu
            if (this.mainMenuMusic) {
                this.mainMenuMusic.fadeOut(this, 500, () => this.setUpMusic());
            } else {
                this.setUpMusic();
            }
        }
    }

    update(): void {
        this.mountains.tilePositionX -= 0.35;
        this.hills.tilePositionX -= 1.75;
        this.grass.tilePositionX -= 3.75;
    }

    /**
     * Sets up the game music.
     */
    private setUpMusic() {
        let fullVolume = 0.1;
        let fadeMillis = 500;
        this.music = new MusicTracks({
            sound: this.sound,
            songName: 'duality',
            trackFlags: {
                'melodica': true,
                'ocarina': true,
                'rhythm': true,
                'uke': true,
                'vocal-guitar': true
            }
        });
        this.music.play();
        this.music.fadeIn(this, fullVolume, fadeMillis);
    }
}
