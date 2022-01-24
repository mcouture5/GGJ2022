import { Scene, Game } from 'phaser';
import { DISPLAY_SIZE } from '../constants';
import {MusicTracks, MusicUtils} from "../MusicTracks";

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
        this.music = {};
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
                MusicUtils.fadeOut(this, this.mainMenuMusic, 500, () => this.setUpMusic());
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
        let startVolume = 0.1;
        let fullVolume = 0.1;
        let fadeMillis = 500;
        this.music.melodica = this.sound.add('duality-melodica', {volume: startVolume});
        this.music.ocarina = this.sound.add('duality-ocarina', {volume: startVolume});
        this.music.rhythm = this.sound.add('duality-rhythm', {volume: startVolume});
        this.music.uke = this.sound.add('duality-uke', {volume: startVolume});
        this.music.vocalGuitar = this.sound.add('duality-vocal-guitar', {volume: startVolume});
        MusicUtils.play(this.music);
        MusicUtils.fadeIn(this, this.music, fullVolume, fadeMillis);
        // manually loop when music.vocalGuitar is done. automatic looping is too imprecise.
        this.music.vocalGuitar.on('complete', () => MusicUtils.play(this.music));
    }
}
