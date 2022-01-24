import { DISPLAY_SIZE } from "../constants";
import { MusicTracks, MusicUtils } from "../MusicTracks";

export class MainMenu extends Phaser.Scene {

    private musicIsSetUp: boolean;
    private music: MusicTracks;

    constructor() {
        super({
            key: 'MainMenu'
        });

        this.musicIsSetUp = false;
        this.music = {};
    }

    init() {
        
    }

    create() {
        let bg = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'mainmenu').setOrigin(0.5, 0.5);
        bg.displayWidth = DISPLAY_SIZE.width;
        bg.displayHeight = DISPLAY_SIZE.height;

        let textContainer = this.add.container(20, 20);
        let texts = [
            new Phaser.GameObjects.Text(this.scene.scene, 80, 80,
                'Just The',
                {
                    fontFamily: 'Ace',
                    fontSize: '8rem',
                    color: '#000'
                }),
                
            new Phaser.GameObjects.Text(this.scene.scene, 263, 120,
                '4',
                {
                    fontFamily: 'Ace',
                    fontSize: '12rem',
                    color: '#000'
                }),
                
            new Phaser.GameObjects.Text(this.scene.scene, 370, 210,
                'Of Us',
                {
                    fontFamily: 'Ace',
                    fontSize: '5rem',
                    color: '#000'
                })
        ];
        textContainer.add(texts);
        
        let buttonContainer = this.add.container(250, 440);
        let startButton = new Phaser.GameObjects.Rectangle(this.scene.scene, 0, 0, 207, 105, 0xffffff, 1)
        startButton.setInteractive({useHandCursor: true});
        startButton.on('pointerup', () => {
            this.scene.start('GameScene', {mainMenuMusic: this.music});
        });
        let startText = new Phaser.GameObjects.Text(this.scene.scene, 0, 0,
            'Start',
            {
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
            let startVolume = 0.1;
            let fullVolume = 0.75;
            let fadeMillis = 1000;
            this.music.melodica = this.sound.add('duality-melodica', {volume: startVolume});
            this.music.ocarina = this.sound.add('duality-ocarina', {volume: startVolume});
            this.music.uke = this.sound.add('duality-uke', {volume: startVolume});
            MusicUtils.play(this.music);
            MusicUtils.fadeIn(this, this.music, fullVolume, fadeMillis);
            // manually loop when music.uke is done. automatic looping is too imprecise.
            this.music.uke.on('complete', () => MusicUtils.play(this.music));
        }
    }

    update() {
        
    }
}
