import { MusicTracks } from '../MusicTracks';
import { BACKGROUND_RBG, DISPLAY_SIZE } from '../constants';

const { r, g, b } = BACKGROUND_RBG;
export class MainMenu extends Phaser.Scene {
    private music: MusicTracks;
    private sky: Phaser.GameObjects.Sprite;
    private mountains: Phaser.GameObjects.TileSprite;
    private hills: Phaser.GameObjects.TileSprite;
    private grass: Phaser.GameObjects.TileSprite;
    private road: Phaser.GameObjects.Sprite;
    private help: Phaser.GameObjects.Sprite;
    private credits: Phaser.GameObjects.Sprite;

    constructor() {
        super({
            key: 'MainMenu'
        });
    }

    init() {}

    create() {
        this.sky = this.add.sprite(0, 0, 'sky').setOrigin(0);
        this.mountains = this.add.tileSprite(0, 0, DISPLAY_SIZE.width, DISPLAY_SIZE.height, 'mountains').setOrigin(0);
        this.hills = this.add.tileSprite(0, 0, DISPLAY_SIZE.width, DISPLAY_SIZE.height, 'hills').setOrigin(0);
        this.grass = this.add.tileSprite(0, 0, DISPLAY_SIZE.width, DISPLAY_SIZE.height, 'grass').setOrigin(0);
        this.road = this.add.sprite(0, 0 + 45, 'road').setOrigin(0);

        this.help = this.add.sprite(0, 0, 'help').setOrigin(0).setAlpha(0).setDepth(100);
        this.help.setInteractive({ useHandCursor: true });
        this.help.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
            this.help.setAlpha(0);
        });

        this.credits = this.add.sprite(0, 0, 'credits').setOrigin(0).setAlpha(0).setDepth(100);
        this.credits.setInteractive({ useHandCursor: true });
        this.credits.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
            this.credits.setAlpha(0);
        });

        let textContainer = this.add.container(20, 20);
        let texts = [
            new Phaser.GameObjects.Text(this.scene.scene, 80, 80, 'Just The', {
                fontFamily: 'Ace',
                fontSize: '9rem',
                color: '#000'
            }),

            new Phaser.GameObjects.Text(this.scene.scene, 285, 140, '4', {
                fontFamily: 'Ace',
                fontSize: '13rem',
                color: '#000'
            }),

            new Phaser.GameObjects.Text(this.scene.scene, 395, 215, 'Of Us', {
                fontFamily: 'Ace',
                fontSize: '6rem',
                color: '#000'
            })
        ];
        textContainer.add(texts);

        let buttonContainer = this.add.container(350, 440);
        let startButton = new Phaser.GameObjects.Rectangle(this.scene.scene, 0, 0, 207, 105, 0xffffff, 1);
        startButton.setInteractive({ useHandCursor: true });
        startButton.on('pointerup', () => {
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.music.fadeOut(this, 1000);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                setTimeout(() => {
                    this.scene.start('CharacterCreation');
                }, 750);
                this.music.stop();
            });
        });
        let startText = new Phaser.GameObjects.Text(this.scene.scene, 0, 0, 'Start', {
            fontFamily: 'Ace',
            fontSize: '6rem',
            color: '#000'
        }).setOrigin(0.5, 0.5);
        
        let helpButton = new Phaser.GameObjects.Rectangle(this.scene.scene, 0, 150, 250, 105, 0xffffff, 1);
        helpButton.setInteractive({ useHandCursor: true });
        helpButton.on('pointerup', () => {
            this.help.setAlpha(1);
        });
        let helpText = new Phaser.GameObjects.Text(this.scene.scene, 0, 150, 'How To Play', {
            fontFamily: 'Ace',
            fontSize: '3rem',
            color: '#000'
        }).setOrigin(0.5, 0.5);
        
        let creditsButton = new Phaser.GameObjects.Rectangle(this.scene.scene, 0, 300, 220, 105, 0xffffff, 1);
        creditsButton.setInteractive({ useHandCursor: true });
        creditsButton.on('pointerup', () => {
            this.credits.setAlpha(1);
        });
        let creditsText = new Phaser.GameObjects.Text(this.scene.scene, 0, 300, 'Credits', {
            fontFamily: 'Ace',
            fontSize: '4rem',
            color: '#000'
        }).setOrigin(0.5, 0.5);

        buttonContainer.add([startButton, startText, helpButton, helpText, creditsButton, creditsText]);

        // do not pause sounds on blur
        this.sound.pauseOnBlur = false;
        // start playing music tracks if not already playing. fade it in.
        if (!this.music || !this.music.isPlaying()) {
            let fullVolume = 0.75;
            let fadeMillis = 350;
            this.music = new MusicTracks({
                sound: this.sound,
                songName: 'duality',
                trackFlags: {
                    'melodica': true,
                    'ocarina': true,
                    'uke': true
                }
            });
            this.music.play();
            this.music.fadeIn(this, fullVolume, fadeMillis);
        }
    }

    update() {
        this.mountains.tilePositionX -= 0.35;
        this.hills.tilePositionX -= 1.75;
        this.grass.tilePositionX -= 3.75;
    }
}
