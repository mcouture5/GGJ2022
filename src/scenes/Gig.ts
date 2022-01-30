import {BACKGROUND_RBG, DISPLAY_SIZE} from '../constants';
import LoadoutGenerator from '../LoadoutGenerator';
import { MusicTracks } from '../MusicTracks';
import { CONVERSATION_COMPLETE } from '../objects/Conversation';
import { GameScene, GameState } from './GameScene';

const FIGURES = ['orangespotlight', 'pinkspotlight', 'bluespotlight', 'greenspotlight'];
const TINTS = [0xfec975, 0xff74a3, 0x74aaff, 0x74ff78];

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

    preload() {
        this.load.pack('gig', './assets/gig.json');
        this.load.json('gig_bad', './assets/conversations/gig_bad.json');
        this.load.json('gig_okay', './assets/conversations/gig_okay.json');
        this.load.json('gig_best', './assets/conversations/gig_best.json');
    }

    create(): void {
        let bg = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'gig').setOrigin(0.5, 0.5);
        bg.displayWidth = DISPLAY_SIZE.width + 66;
        bg.displayHeight = DISPLAY_SIZE.height + 66;

        let spotlights = this.add.container(DISPLAY_SIZE.width / 2, DISPLAY_SIZE.height / 2 + 125); 
        for (let i = 0; i < this.gameState.characters.length; i++) {
            let xPos = (i * 160) - this.gameState.characters.length * 40;
            let character = this.gameState.characters[i];
            let figure = this.add.sprite(xPos, 0, FIGURES[i]).setOrigin(1, 1);
            spotlights.add(figure);
            let portrait = LoadoutGenerator.createFaceSprite(this, character.face).setScale(0.13).setOrigin(0.5).setPosition(xPos - 66, -211).setAlpha(0.85);
            spotlights.add(portrait);
            let spotlight = this.add.sprite(xPos, -4, 'spotlight').setOrigin(1, 1).setAlpha(0.3).setTint(TINTS[i]);
            spotlights.add(spotlight);
        }

        let performance = this.getPerformance(this.gameState.bandHappiness);
        let income = this.getIncome(performance);

        setTimeout(() => {
            let recordManager = this.add.sprite(DISPLAY_SIZE.width * 2, DISPLAY_SIZE.height, 'manager', 0)
                .setOrigin(1, 1)
                .setDepth(10);
            this.tweens.add({
                targets: recordManager,
                x: DISPLAY_SIZE.width,
                duration: 500,
                onComplete: () => {
                    let convo = this.add.conversation(800, 600, 'gig_best').setPosition(40, 40);
                    convo.setTemplateData({
                        income: '' + income
                    });
                    convo.on(CONVERSATION_COMPLETE, () => {
                        this.gameState.wallet.add(income, 'Gig Income');
                        this.tweens.add({
                            targets: recordManager,
                            x: DISPLAY_SIZE.width * 2,
                            duration: 500,
                            onComplete: () => {
                                buttonContainer.setAlpha(1);
                            }
                        });
                    });
                    convo.begin();
                }
            });
        }, 1000);

        let buttonContainer = this.add.container(250, 840).setAlpha(0);
        let continueButton = new Phaser.GameObjects.Rectangle(this.scene.scene, 0, 0, 320, 105, 0xffffff, 1);
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
            return 0.45;
        } else if (gigNumMod3 === 2) { // 2nd gig
            return 1;
        } else if (gigNumMod3 === 0) { // 3rd gig
            return 0.75;
        }
    }

    private getPerformance(performance: number): PerformanceRating {
        if (performance < 100) {
            return 'poor';
        }
        if (performance < 200) {
            return 'okay';
        }
        if (performance < 300) {
            return 'good';
        }
        return 'excellent';
    };
    
    private getIncome(performance: PerformanceRating): number {
        switch(performance) {
            case 'poor':
                return 100;
            case 'okay':
                return 250;
            case 'good':
                return 500;
            case 'excellent':
                return 1000;
        }
    }
}
