import { BACKGROUND_RBG, DISPLAY_SIZE } from '../constants';
import { CharacterState, GameScene, GameSceneConfig } from './GameScene';

import { CONVERSATION_COMPLETE } from '../objects/Conversation';
import { Form, SIGNED_EVENT } from '../objects/editor/Form';
import LoadoutGenerator from '../LoadoutGenerator';
import {TRACK_NAMES} from "../MusicTracks";
const { r, g, b } = BACKGROUND_RBG;

interface CharacterCreationConfig {
    // TODO
}

export class CharacterCreation extends Phaser.Scene {
    private overlay: Phaser.GameObjects.Rectangle;
    private recordManager: Phaser.GameObjects.Sprite;

    private conversation: IConversation;
    public loadout: Loadout;

    private music: Phaser.Sound.BaseSound;

    constructor() {
        super({
            key: 'CharacterCreation'
        });
    }

    init(config: CharacterCreationConfig): void {
        this.loadout = LoadoutGenerator.getDefaultLoadout();
    }

    create() {
        let bg = this.add
            .sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'office')
            .setOrigin(0.5, 0.5)
            .setDepth(0);
        bg.displayWidth = DISPLAY_SIZE.width;
        bg.displayHeight = DISPLAY_SIZE.height;

        this.recordManager = this.add
            .sprite(DISPLAY_SIZE.width - 400, -DISPLAY_SIZE.height, 'manager', 0)
            .setOrigin(0.5, 0.5)
            .setDepth(10);
        let desk = this.add
            .sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'desk')
            .setOrigin(0.5, 0.5)
            .setDepth(20);
        desk.displayWidth = DISPLAY_SIZE.width;

        this.overlay = this.add.rectangle(0, 0, DISPLAY_SIZE.width, DISPLAY_SIZE.height, 0x000000, 0.65).setOrigin(0, 0).setAlpha(0).setDepth(5);
        this.conversation = this.add.conversation('character_creation').setDepth(50).setX(40).setY(40);

        // DEBUG
        //let form = new Form(this, this.loadout).setDepth(50).setPosition(DISPLAY_SIZE.width / 2 - 350, DISPLAY_SIZE.height / 2 - 450);
        //this.add.existing(form);
        //form.on(SIGNED_EVENT, () => this.beginGame());
        // DEBUG

        this.tweens.add({
            targets: this.overlay,
            alpha: { from: 0, to: 1 },
            delay: 1500,
            duration: 500,
            onComplete: () => {
                // DEBUG - reverse
                this.introduceCreation();
                // DEBUG - reverse
            }
        });

        // do not pause sounds on blur
        this.sound.pauseOnBlur = false;
        // start playing music tracks if not already playing. DO NOT fade it in.
        if (!this.music || !this.music.isPlaying) {
            this.music = this.sound.add('broken-records', { volume: 0.2, loop: true });
            this.music.play();
        }
    }

    private introduceCreation() {
        let timeline = this.tweens.createTimeline();
        timeline.add({ targets: this.recordManager, y: { from: DISPLAY_SIZE.height + 210, to: DISPLAY_SIZE.height + 90 }, duration: 1500 });
        timeline.add({ targets: this.recordManager, alpha: 1, duration: 1000 });
        timeline.add({ targets: this.recordManager, y: DISPLAY_SIZE.height - 190, duration: 500 });
        timeline.on('complete', () => {
            // Prepare handle for the end of the first conversation.
            this.conversation.on(CONVERSATION_COMPLETE, () => {
                let form = new Form(this, this.loadout).setDepth(50).setPosition(DISPLAY_SIZE.width / 2 - 350, DISPLAY_SIZE.height * 2); // way off screen to start
                form.on(SIGNED_EVENT, () => {
                    this.tweens.add({
                        targets: form,
                        y: DISPLAY_SIZE.height * 2,
                        duration: 500,
                        onComplete: () => {
                            // Remove the old conversation and begin a new one
                            this.conversation.destroy();
                            this.conversation = this.add.conversation('signed_contract').setDepth(50).setX(40).setY(40);
                            this.conversation.on(CONVERSATION_COMPLETE, () => {
                                this.beginGame();
                            });
                            this.conversation.begin();
                        }
                    });
                });
                this.add.existing(form);
                this.tweens.add({
                    targets: form,
                    y: DISPLAY_SIZE.height / 2 - 450,
                    duration: 500
                });
            });

            // Start the first conversation
            this.conversation.begin();
        });
        timeline.play();
    }

    private beginGame() {
        // fade out camera and music
        this.cameras.main.fadeOut(350, r, g, b);
        this.add.tween({
            targets: this.music,
            volume: 0,
            ease: 'Linear',
            duration: 350
        });
        // when camera fade is done...
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            // Set up the main character with info from the loadout
            let you: CharacterState = LoadoutGenerator.loadoutToDriverCharacterState(this.loadout);
            // Set up the first random band member
            let randoLoadout = LoadoutGenerator.generateRandomLoadout();
            let randoSeatPosition = 2;
            let availableInstruments = TRACK_NAMES.filter(trackName => trackName !== 'vocal-guitar');
            let randoInstrument = availableInstruments[Phaser.Math.Between(0, availableInstruments.length - 1)];
            let rando: CharacterState = LoadoutGenerator.loadoutToRandomCharacterState(randoLoadout, randoSeatPosition,
                randoInstrument);
            // stop music just in case fade isn't complete yet
            this.music.stop();
            // switch to GameScene
            this.scene.start('GameScene', {
                gameState: {
                    bandName: this.loadout.bandName,
                    characters: [you, rando]
                }
            } as GameSceneConfig);
        });
    }
}
