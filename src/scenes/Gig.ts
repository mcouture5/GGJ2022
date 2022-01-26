import {BACKGROUND_RBG, DISPLAY_SIZE} from '../constants';
import { MusicTracks, TrackName } from '../MusicTracks';

// configuration object passed into init()
export interface GigConfig {
    // name of the song for the gig
    songName: string;
    // trackFlags of current bandmembers' instruments
    trackFlags: {[key in TrackName]?: boolean}
}

export class Gig extends Phaser.Scene {

    private songName: string;
    private trackFlags: {[key in TrackName]?: boolean};
    private music: MusicTracks;

    constructor() {
        super({
            key: 'Gig'
        });
    }

    init(config: GigConfig): void {
        this.songName = config.songName;
        this.trackFlags = config.trackFlags;
    }

    create(): void {
        let bg = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'mainmenu').setOrigin(0.5, 0.5);
        bg.displayWidth = DISPLAY_SIZE.width;
        bg.displayHeight = DISPLAY_SIZE.height;

        let buttonContainer = this.add.container(250, 440);
        let continueButton = new Phaser.GameObjects.Rectangle(this.scene.scene, 0, 0, 207, 105, 0xffffff, 1);
        continueButton.setInteractive({ useHandCursor: true });
        continueButton.on('pointerup', () => {
            // fade out camera and music
            this.cameras.main.fadeOut(350, BACKGROUND_RBG.r, BACKGROUND_RBG.g, BACKGROUND_RBG.b);
            this.music.fadeOut(this, 350);
            // when camera fade is done...
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                // stop music just in case fade isn't complete yet
                this.music.stop();
                // switch back to GameScene
                this.scene.start('GameScene');
            });
        });
        let startText = new Phaser.GameObjects.Text(this.scene.scene, 0, 0, 'Continue', {
            fontFamily: 'Ace',
            fontSize: '6rem',
            color: '#000'
        }).setOrigin(0.5, 0.5);
        buttonContainer.add([continueButton, startText]);

        // do not pause sounds on blur
        this.sound.pauseOnBlur = false;
        // start playing music tracks if not already set up. fade it in.
        if (!this.music || !this.music.isPlaying()) {
            let fullVolume = 0.75;
            let fadeMillis = 350;
            this.music = new MusicTracks({
                sound: this.sound,
                songName: this.songName,
                trackFlags: this.trackFlags
            });
            this.music.play();
            this.music.fadeIn(this, fullVolume, fadeMillis);
        }
    }

    update(): void {}
}
