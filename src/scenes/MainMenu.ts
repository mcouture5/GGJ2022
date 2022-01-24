import { MusicTracks } from '../MusicTracks';
import { BACKGROUND_RBG, DISPLAY_SIZE } from '../constants';

const { r, g, b } = BACKGROUND_RBG;
export class MainMenu extends Phaser.Scene {
    private musicIsSetUp: boolean;
    private music: MusicTracks;

    constructor() {
        super({
            key: 'MainMenu'
        });

        this.musicIsSetUp = false;
        this.music = null;
    }

    init() {}

    create() {
        let bg = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'mainmenu').setOrigin(0.5, 0.5);
        bg.displayWidth = DISPLAY_SIZE.width;
        bg.displayHeight = DISPLAY_SIZE.height;

        let textContainer = this.add.container(20, 20);
        let texts = [
            new Phaser.GameObjects.Text(this.scene.scene, 80, 80, 'Just The', {
                fontFamily: 'Ace',
                fontSize: '8rem',
                color: '#000'
            }),

            new Phaser.GameObjects.Text(this.scene.scene, 263, 120, '4', {
                fontFamily: 'Ace',
                fontSize: '12rem',
                color: '#000'
            }),

            new Phaser.GameObjects.Text(this.scene.scene, 370, 210, 'Of Us', {
                fontFamily: 'Ace',
                fontSize: '5rem',
                color: '#000'
            })
        ];
        textContainer.add(texts);

        let buttonContainer = this.add.container(250, 440);
        let startButton = new Phaser.GameObjects.Rectangle(this.scene.scene, 0, 0, 207, 105, 0xffffff, 1);
        startButton.setInteractive({ useHandCursor: true });
        startButton.on('pointerup', () => {
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('CharacterCreation', { mainMenuMusic: this.music });
            });
            this.cameras.main.fadeOut(350, r, g, b);
        });
        let startText = new Phaser.GameObjects.Text(this.scene.scene, 0, 0, 'Start', {
            fontFamily: 'Ace',
            fontSize: '6rem',
            color: '#000'
        }).setOrigin(0.5, 0.5);
        buttonContainer.add([startButton, startText]);

        // do not pause sounds on blur
        this.sound.pauseOnBlur = false;
        // start playing music tracks if not already set up. fade it in.
        if (!this.musicIsSetUp) {
            this.musicIsSetUp = true;
            let fullVolume = 0.75;
            let fadeMillis = 1000;
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

    update() {}
}
