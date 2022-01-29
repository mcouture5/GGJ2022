import { MusicTracks } from '../MusicTracks';
import { BACKGROUND_RBG, DISPLAY_SIZE } from '../constants';

const { r, g, b } = BACKGROUND_RBG;
export class MainMenu extends Phaser.Scene {

    private music: MusicTracks;

    constructor() {
        super({
            key: 'MainMenu'
        });
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
            this.cameras.main.fadeOut(350, r, g, b);
            this.music.fadeOut(this, 350);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.music.stop();
                this.scene.start('CharacterCreation');
            });
        });
        let startText = new Phaser.GameObjects.Text(this.scene.scene, 0, 0, 'Start', {
            fontFamily: 'Ace',
            fontSize: '6rem',
            color: '#000'
        }).setOrigin(0.5, 0.5);
        buttonContainer.add([startButton, startText]);

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

    update() {}
}
