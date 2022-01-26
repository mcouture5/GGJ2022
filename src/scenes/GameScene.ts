import { BACKGROUND_RBG, DISPLAY_SIZE } from '../constants';
import { MusicTracks } from '../MusicTracks';
import { GigConfig } from './Gig';

const NIGHT_OVERLAY_ALPHA = 0.26; // matches dayOverlay's built-in alpha
const DAY_NIGHT_FADE_MILLIS = 1000;

// configuration object passed into init()
interface GameSceneConfig {
    // TODO
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

    private music: MusicTracks;
    private morningSound: Phaser.Sound.BaseSound;
    private nightSound: Phaser.Sound.BaseSound;

    constructor() {
        super({
            key: 'GameScene'
        });
    }

    init(config: GameSceneConfig): void {
        // TODO
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
        this.isDay = true;
        this.dayNum = 1;
        this.dayNightTimer = this.time.addEvent({
            callback: () => {
                if (this.isDay) {
                    this.switchToNight();
                } else {
                    this.switchToDay();
                }
            },
            delay: 5000, // TODO: make this 30 seconds when we're done testing things
            repeat: 5
        });

        // do not pause sounds on blur
        this.sound.pauseOnBlur = false;
        // start playing music tracks if not already playing. fade it in.
        if (!this.music || !this.music.isPlaying()) {
            let fullVolume = 0.2;
            let fadeMillis = 350;
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
        this.isDay = false;
        this.add.tween({
            targets: this.dayOverlay,
            alpha: 0,
            ease: 'Linear',
            duration: DAY_NIGHT_FADE_MILLIS
        });
        this.add.tween({
            targets: this.nightOverlay,
            alpha: NIGHT_OVERLAY_ALPHA,
            ease: 'Linear',
            duration: DAY_NIGHT_FADE_MILLIS,
            onComplete: () => {
                this.nightSound.play();
            }
        });
    }

    private switchToDay(): void {
        this.isDay = true;
        // increment dayNum each day
        this.dayNum++;

        // if this is the 4th day, STOP and trigger major event (gig or new band member)
        if (this.dayNum > 3) {
            this.dayNum = 1;
            this.triggerMajorEvent();
            return;
        }

        this.add.tween({
            targets: this.dayOverlay,
            alpha: 1,
            ease: 'Linear',
            duration: DAY_NIGHT_FADE_MILLIS,
            onComplete: () => {
                this.morningSound.play();
            }
        });
        this.add.tween({
            targets: this.nightOverlay,
            alpha: 0,
            ease: 'Linear',
            duration: DAY_NIGHT_FADE_MILLIS
        });
    }

    /**
     * Triggers a major event (gig or new band member).
     */
    private triggerMajorEvent(): void {
        // fade out camera and music
        this.cameras.main.fadeOut(350, BACKGROUND_RBG.r, BACKGROUND_RBG.g, BACKGROUND_RBG.b);
        this.music.fadeOut(this, 350);
        // when camera fade is done...
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            // stop music just in case fade isn't complete yet
            this.music.stop();
            // 50% switch to Gig scene, 50% switch to NewBandmember scene
            if (Phaser.Math.Between(0, 1) === 0) {
                this.scene.start('Gig', {
                    // TODO: change song name after gig
                    songName: 'duality',
                    // TODO make trackFlags actually reflect the bandmembers' instruments
                    trackFlags: {
                        'melodica': true,
                        'ocarina': true,
                        'rhythm': true,
                        'uke': true,
                        'vocal-guitar': true
                    }
                } as GigConfig);
            } else {
                this.scene.start('NewBandmember');
            }
        });
    }
}
