import { DISPLAY_SIZE } from "../constants";
import { CONVERSATION_COMPLETE } from "../objects/Conversation";
import { GameState } from "./GameScene";

export interface GameOverConfig {
    gameState: GameState;
}


export default class GameOver extends Phaser.Scene {
    private overlay: Phaser.GameObjects.Rectangle;
    private recordManager: Phaser.GameObjects.Sprite;
    private conversation: IConversation;
    private gameState: GameState;
    private music: Phaser.Sound.BaseSound;

    constructor() {
        super({
            key: 'GameOver'
        });
    }
    
    init(config: GameOverConfig): void {
        this.gameState = config.gameState;
    }

    preload() {
        this.load.json('game_over', './assets/conversations/game_over.json');
    }

    create() {
        this.cameras.main.fadeIn(1250, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, () => {
            setTimeout(() => {
                this.tweens.add({
                    targets: this.overlay,
                    alpha: { from: 0, to: 1 },
                    duration: 500,
                    onComplete: () => {
                        this.conversation.begin();
                        // Prepare handle for the end of the first conversation.
                        this.conversation.on(CONVERSATION_COMPLETE, () => {
                            // fade out camera and music
                            this.cameras.main.fadeOut(2750, 0, 0, 0);
                            this.add.tween({
                                targets: this.music,
                                volume: 0,
                                ease: 'Linear',
                                duration: 2750
                            });
                            // when camera fade is done...
                            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                                // stop music just in case fade isn't complete yet
                                this.music.stop();
                                this.scene.start('MainMenu');
                            });
                        });
                    }
                });
            }, 500);
        });
        let bg = this.add
            .sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'office')
            .setOrigin(0.5, 0.5)
            .setDepth(0);
        bg.displayWidth = DISPLAY_SIZE.width;
        bg.displayHeight = DISPLAY_SIZE.height;

        this.recordManager = this.add
            .sprite(DISPLAY_SIZE.width - 525, DISPLAY_SIZE.height, 'manager', 0)
            .setOrigin(0.5, 1)
            .setDepth(10);
        let desk = this.add
            .sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'desk')
            .setOrigin(0.5, 0.5)
            .setDepth(20);
        desk.displayWidth = DISPLAY_SIZE.width;
        
        this.overlay = this.add.rectangle(0, 0, DISPLAY_SIZE.width, DISPLAY_SIZE.height, 0x000000, 0.65).setOrigin(0, 0).setAlpha(0).setDepth(5);
        this.conversation = this.add.conversation(800, 600, 'game_over').setDepth(50).setPosition(80, 80);

        // do not pause sounds on blur
        this.sound.pauseOnBlur = false;
        // start playing music tracks if not already playing. DO NOT fade it in.
        if (!this.music || !this.music.isPlaying) {
            this.music = this.sound.add('broken-records', { volume: 0, loop: true });
            this.music.play();
            this.add.tween({
                targets: this.music,
                volume: {from: 0, to: 0.1},
                ease: 'Linear',
                duration: 1250
            });
        }
    }
}
