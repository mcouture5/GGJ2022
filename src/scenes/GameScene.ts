import { Scene, Game } from 'phaser';
import { DISPLAY_SIZE } from '../constants';
import { MusicTracks } from "../MusicTracks";

const NIGHT_OVERLAY_ALPHA = 0.26; // matches dayOverlay's built-in alpha

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

    private dayNightTimer: Phaser.Time.TimerEvent;
    private isDay: boolean;
    private dayNum: number;

    private mainMenuMusic: MusicTracks;
    private musicIsSetUp: boolean;
    private music: MusicTracks;
    private morningSound: Phaser.Sound.BaseSound;
    private nightSound: Phaser.Sound.BaseSound;

    constructor() {
        super({
            key: 'GameScene'
        });

        // start with day before going to night
        this.isDay = true;
        this.dayNum = 1;

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

        // start with day before going to night
        this.dayOverlay = this.add.sprite(DISPLAY_SIZE.width / 2, DISPLAY_SIZE.height / 2, 'dayoverlay').setOrigin(0.5, 0.5).setAlpha(1);
        this.nightOverlay = this.add.sprite(DISPLAY_SIZE.width / 2, DISPLAY_SIZE.height / 2, 'nightoverlay').setOrigin(0.5, 0.5).setAlpha(0);

        // set up day/night cycles. 6 transitions 30 seconds apart, creating 3 in-game days that elapse in 3 irl
        // minutes. the last transition marks the end of the last night and triggers a major event
        // (gig or new band member).
        this.dayNightTimer = this.time.addEvent({
            callback: () => {
                if (this.isDay) {
                    this.switchToNight()
                } else {
                    this.switchToDay();
                }
            },
            delay: 5000, // TODO: make this 30 seconds when we're done testing things
            repeat: 5
        });

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
        // set up sound effects
        this.morningSound = this.sound.add('morning', {volume: 0.5});
        this.nightSound = this.sound.add('night', {volume: 1});
    }

    update(): void {
        this.mountains.tilePositionX -= 0.35;
        this.hills.tilePositionX -= 1.75;
        this.grass.tilePositionX -= 3.75;
    }

    private switchToNight(): void {
        this.dayOverlay.setAlpha(0);
        this.nightOverlay.setAlpha(NIGHT_OVERLAY_ALPHA);
        this.nightSound.play();
        this.isDay = false;
    }

    private switchToDay(): void {
        // increment dayNum each day
        this.dayNum++;

        // if about to switch to 4th day, STOP and trigger major event (gig or new band member)
        if (this.dayNum > 3) {
            this.dayNum = 0;
            this.triggerMajorEvent();
            return;
        }

        this.dayOverlay.setAlpha(1);
        this.nightOverlay.setAlpha(0);
        this.morningSound.play();
        this.isDay = true;
    }

    /**
     * Triggers a major event (gig or new band member).
     */
    private triggerMajorEvent(): void {
        alert("MAJOR EVENT: gig or new band member");
    }

    /**
     * Sets up the game music.
     */
    private setUpMusic(): void {
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
