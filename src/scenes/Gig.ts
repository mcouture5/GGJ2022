import {BACKGROUND_RBG, DISPLAY_SIZE} from '../constants';
import { MusicTracks } from '../MusicTracks';
import { GameScene, GameState } from './GameScene';

// configuration object passed into init()
export interface GigConfig {
    gameState: GameState;
}

export class Gig extends Phaser.Scene {

    private gameState: GameState;
    private music: MusicTracks;

    constructor() {
        super({
            key: 'Gig'
        });
    }

    init(config: GigConfig): void {
        this.gameState = config.gameState;
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
                // increment gigNum
                this.gameState.gigNum++;
                // switch back to GameScene
                this.scene.start('GameScene', {gameState: this.gameState});
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
    }

    update(): void {}

    /**
     * Converts a gigNum into the appropriate music full volume.
     */
    private gigNumToFullVolume(gigNum: any): number {
        let gigNumMod3 = gigNum % 3;
        if (gigNumMod3 === 1) { // 1st gig
            return 0.75;
        } else if (gigNumMod3 === 2) { // 2nd gig
            return 1;
        } else if (gigNumMod3 === 0) { // 3rd gig
            return 0.75;
        }
    }
}
