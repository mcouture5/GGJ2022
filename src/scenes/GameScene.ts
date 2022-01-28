import { BACKGROUND_RBG, DISPLAY_SIZE } from '../constants';
import { MusicTracks, TrackName } from '../MusicTracks';
import { GigConfig } from './Gig';

const NIGHT_OVERLAY_ALPHA = 0.26; // matches dayOverlay's built-in alpha
const DAY_NIGHT_FADE_MILLIS = 1000;

// configuration object passed into init()
export interface GameSceneConfig {
    // the game state from the previous scene
    gameState: GameState
}

export interface GameState {
    characters: CharacterState[];
    // which day are we on. defaults to 1. the first morning marks day 1. the second morning marks day 2. on the
    // morning of day 4, a major event happens before the day actually starts (gig or new bandmember). on the morning
    // of day 7, a major event happens. etc.
    dayNum?: number;
    // which gig are we driving to or currently playing at. defaults to 1. the first gig is gig 1. the second gig is
    // gig 2.
    gigNum?: number;
    // the major events left. defaults to a copy of the MAJOR_EVENTS list. makes the CPU randomness feel more like
    // human randomness.
    majorEventsLeft?: MajorEvent[];
}

export interface CharacterState {
    name: string;
    // defaults to false
    isDriver?: boolean;
    // TODO: establish a numbering system for the seat positions
    seatPosition: number;
    dayTrait: string;
    nightTrait: string;
    instrument: TrackName;
    // starts at 100. maxes at 100. rage quits at 0. leading up to first gig, decreases by 1 every second in unhappy
    // situation and increases by 1 every second in a happy situation. leading up to second gig, decreases/increases by
    // 2 every second. leading up to the third gig, 3 every second. etc. up to a max of 5.
    happiness: number;
}

export const enum MajorEvent {
    Gig = 'Gig',
    NewBandmember = 'NewBandmember'
}
export const MAJOR_EVENTS = [MajorEvent.Gig, MajorEvent.NewBandmember];

export class GameScene extends Phaser.Scene {

    private sky: Phaser.GameObjects.Sprite;
    private mountains: Phaser.GameObjects.TileSprite;
    private hills: Phaser.GameObjects.TileSprite;
    private grass: Phaser.GameObjects.TileSprite;
    private dayOverlay: Phaser.GameObjects.Sprite;
    private nightOverlay: Phaser.GameObjects.Sprite;

    private gameState: GameState;
    private dayNightTimer: Phaser.Time.TimerEvent;
    private isDay: boolean;

    private music: MusicTracks;
    private morningSound: Phaser.Sound.BaseSound;
    private nightSound: Phaser.Sound.BaseSound;

    constructor() {
        super({
            key: 'GameScene'
        });
    }

    init(config: GameSceneConfig): void {
        // apply defaults to gameState config
        this.gameState = Object.assign({
            dayNum: 1,
            gigNum: 1,
            majorEventsLeft: MAJOR_EVENTS.slice()
        }, config.gameState);
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
            let fullVolume = this.gigNumToFullVolume(this.gameState.gigNum);
            let fadeMillis = 350;
            this.music = new MusicTracks({
                sound: this.sound,
                songName: GameScene.gigNumToSongName(this.gameState.gigNum),
                trackFlags: GameScene.charactersToTrackFlags(this.gameState.characters)
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
        this.gameState.dayNum++;

        // if this is the "4th day" (day after the 3rd modulo day), STOP and trigger major event
        if (this.gameState.dayNum % 3 === 1) {
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
            // if only one major event left, switch to that
            if (this.gameState.majorEventsLeft.length === 1) {
                let majorEvent = this.gameState.majorEventsLeft[0];
                // restore majorEventsLeft back to 2 events
                this.gameState.majorEventsLeft = MAJOR_EVENTS.slice();
                this.switchToMajorEvent(majorEvent);
            }
            // else, randomly pick one
            else {
                let majorEventIndex = Phaser.Math.Between(0, 1);
                let majorEvent = this.gameState.majorEventsLeft[majorEventIndex];
                // remove 1 event from majorEventsLeft
                this.gameState.majorEventsLeft.splice(majorEventIndex, 1);
                this.switchToMajorEvent(majorEvent)
            }
        });
    }

    /**
     * Switches to the provided major event ({@link MajorEvent#Gig} or {@link MajorEvent#NewBandmember}).
     */
    private switchToMajorEvent(majorEvent: MajorEvent): void {
        this.scene.start(majorEvent, {
            gameState: this.gameState
        } as GigConfig);
    }

    /**
     * Converts a gigNum into the appropriate music full volume.
     */
    private gigNumToFullVolume(gigNum: any): number {
        let gigNumMod3 = gigNum % 3;
        if (gigNumMod3 === 1) { // 1st gig
            return 0.2;
        } else if (gigNumMod3 === 2) { // 2nd gig
            return 0.3;
        } else if (gigNumMod3 === 0) { // 3rd gig
            return 0.2;
        }
    }

    /**
     * Converts a gigNum into the appropriate song name.
     */
    static gigNumToSongName(gigNum: number): string {
        let gigNumMod3 = gigNum % 3;
        if (gigNumMod3 === 1) { // 1st gig
            return 'duality';
        } else if (gigNumMod3 === 2) { // 2nd gig
            return 'today';
        } else if (gigNumMod3 === 0) { // 3rd gig
            return 'scootch-over';
        }
    }

    /**
     * Converts a list of character states to the appropriate trackFlags object.
     */
    static charactersToTrackFlags(characters: CharacterState[]): {[key in TrackName]?: boolean} {
        let trackFlags: {[key in TrackName]?: boolean} = {};
        for (let character of characters) {
            trackFlags[character.instrument] = true;
        }
        return trackFlags;
    }
}
