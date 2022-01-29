import { BACKGROUND_RBG, DISPLAY_SIZE } from '../constants';
import { CharacterState, GameScene, GameState } from './GameScene';
import {MusicTracks, TRACK_NAMES, TrackName} from '../MusicTracks';
import LoadoutGenerator from '../LoadoutGenerator';
import { Choice, CONVERSATION_COMPLETE, RESPONSE } from '../objects/Conversation';

// configuration object passed into init()
export interface NewBandmemberConfig {
    gameState: GameState;
}

export class NewBandmember extends Phaser.Scene {

    private gameState: GameState;
    private music: MusicTracks;
    private portrait: Phaser.GameObjects.RenderTexture;
    private bandmember: Loadout;
    private isJoining: boolean;

    constructor() {
        super({
            key: 'NewBandmember'
        });
    }

    init(config: NewBandmemberConfig): void {
        this.gameState = config.gameState;
    }

    create(): void {
        let bg = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'bus_stop').setOrigin(0.5, 0.5);
        bg.displayWidth = DISPLAY_SIZE.width;
        bg.displayHeight = DISPLAY_SIZE.height;
        let overlay = this.add.rectangle(0, 0, DISPLAY_SIZE.width, DISPLAY_SIZE.height, 0x000000, 0.65).setOrigin(0, 0).setAlpha(0).setDepth(5);
        this.bandmember = LoadoutGenerator.generateRandomLoadout();

        this.tweens.add({
            targets: overlay,
            alpha: { from: 0, to: 1 },
            delay: 750,
            duration: 500,
            onComplete: () => {
                this.portrait = LoadoutGenerator.createFaceSprite(this, this.bandmember.face)
                    .setPosition(-DISPLAY_SIZE.width, -DISPLAY_SIZE.height).setOrigin(0.5, 0.5).setDepth(10);
                this.add.existing(this.portrait);  
                this.tweens.add({
                    targets: this.portrait,
                    x: 475,
                    y: DISPLAY_SIZE.height - 250,
                    duration: 500,
                    onComplete: () => {
                        let convo = this.add.conversation(1024, 768, 'bandmember_1', this.bandmember.name).setPosition(DISPLAY_SIZE.width / 2 - 250, 50).setDepth(20);
                        convo.begin();
                        convo.on(RESPONSE, (choice: Choice) => {
                            this.isJoining = choice.data.answer === 'yes';
                        });
                        convo.on(CONVERSATION_COMPLETE, () => {
                            this.tweens.add({
                                targets: this.portrait,
                                x: this.isJoining ? 475 : -DISPLAY_SIZE.width,
                                y: this.isJoining ? DISPLAY_SIZE.height - 250 : -DISPLAY_SIZE.height,
                                alpha: this.isJoining ? 0 : 1,
                                duration: 350,
                                onComplete: () => {
                                    this.music.fadeOut(this, 350);
                                    this.tweens.add({
                                        targets: overlay,
                                        alpha: 0,
                                        duration: 350,
                                        onComplete: () => {
                                            this.music.stop();
                                            // if new bandmember is joining...
                                            if (this.isJoining) {
                                                // if party is full, kick someone out first
                                                if (this.gameState.characters.length >= 4) {
                                                    let tossThisCharacter = Phaser.Math.Between(1, 3);
                                                    this.gameState.characters.splice(tossThisCharacter, 1);
                                                }
                                                // find open seat position and open instrument for them
                                                let seatPosition = this.findOpenSeatPosition(
                                                    this.gameState.characters);
                                                let instrument = this.findOpenInstrument(this.gameState.characters);
                                                // generate random character state
                                                let characterState = LoadoutGenerator.loadoutToRandomCharacterState(
                                                    this.bandmember, seatPosition, instrument);
                                                // add new bandmember to the party
                                                this.gameState.characters.push(characterState);
                                            }
                                            // switch back to GameScene
                                            this.scene.start('GameScene', {gameState: this.gameState});
                                        }
                                    });
                                }
                            });
                        });
                    }
                });          
            }
        });

        // do not pause sounds on blur
        this.sound.pauseOnBlur = false;
        // start playing music tracks if not already set up. fade it in.
        if (!this.music || !this.music.isPlaying()) {
            let fullVolume = this.gigNumToFullVolume(this.gameState.gigNum);
            let fadeMillis = 350;
            this.music = new MusicTracks({
                sound: this.sound,
                songName: GameScene.gigNumToSongName(this.gameState.gigNum),
                trackFlags: this.charactersToTrackFlags(this.gameState.characters)
            });
            this.music.play(this.gigNumToSoundConfig(this.gameState.gigNum));
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

    /**
     * The same as {@link GameScene#charactersToTrackFlags}, except it turns off "vocal-guitar".
     */
    private charactersToTrackFlags(characters: CharacterState[]): {[key in TrackName]?: boolean} {
        let trackFlags = GameScene.charactersToTrackFlags(characters);
        trackFlags['vocal-guitar'] = false;
        return trackFlags;
    }

    /**
     * Converts a gigNum into the appropriate {@link Phaser#Types#Sound#SoundConfig}.
     */
    private gigNumToSoundConfig(gigNum: number): Phaser.Types.Sound.SoundConfig {
        let gigNumMod3 = gigNum % 3;
        if (gigNumMod3 === 1) { // 1st gig
            return undefined;
        } else if (gigNumMod3 === 2) { // 2nd gig
            return {
                seek: 9 // "today" has only vocal-guitar for first 9 seconds
            };
        } else if (gigNumMod3 === 0) { // 3rd gig
            return {
                seek: 13 // "scootch-over" has only vocal-guitar for first 13 seconds
            };
        }
    }

    private findOpenSeatPosition(characters: CharacterState[]): number {
        let availableSeatPositions = [1,2,3,4,5].filter((seatPosition) => {
            for (let character of characters) {
                if (character.seatPosition === seatPosition) {
                    return false;
                }
            }
            return true;
        });
        return availableSeatPositions[Phaser.Math.Between(0, availableSeatPositions.length - 1)];
    }

    private findOpenInstrument(characters: CharacterState[]): TrackName {
        let availableInstruments = TRACK_NAMES.filter((trackName) => {
            for (let character of characters) {
                if (character.instrument === trackName) {
                    return false;
                }
            }
            return true;
        });
        return availableInstruments[Phaser.Math.Between(0, availableInstruments.length - 1)];
    }
}
