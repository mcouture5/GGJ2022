// VERY IMPORTANT TO KEEP THIS
// It needs to be imported as a side effect so the plugin manager will run.
import { BACKGROUND_HEX_COLOR } from '../constants';
import '../plugins.ts';

/**
 * Boot scene shows a loading bar while loading all assets.
 */
export class Boot extends Phaser.Scene {
    private loadingBar: Phaser.GameObjects.Graphics;
    private progressBar: Phaser.GameObjects.Graphics;
    private camera: Phaser.Cameras.Scene2D.Camera;
    private text: Phaser.GameObjects.Text;
    private percent: number = 0;

    constructor() {
        super({
            key: 'Boot'
        });
    }

    preload() {
        // Reference to the main camera
        this.camera = this.cameras.main;

        // set the background and create loading bar
        this.camera.setBackgroundColor('#e4e4eb');
        this.createLoadingbar();

        // pass value to change the loading bar fill
        this.load.on('progress', (value) => {
            this.percent = Math.floor(value * 100);
            this.text.setText(`${this.percent}%`);
            this.progressBar.fillStyle(BACKGROUND_HEX_COLOR, 1);
            this.progressBar.fillRect(this.camera.width / 4, this.camera.height / 2 - 16, (this.camera.width / 2) * value, 16);
        });

        // delete bar graphics, when loading complete
        this.load.on('complete', () => {
            this.text.destroy();
            this.progressBar.destroy();
            this.loadingBar.destroy();
        });

        /**
         * pack is a JSON that contains details about other files that should be added into the Loader.
         * Place ALL files to load in there, separated by sections.
         */
        this.load.pack('assets', './assets/pack.json');
        this.load.json('character_creation', './assets/conversations/intro.json');
        this.load.json('signed_contract', './assets/conversations/signedContract.json');
        this.load.json('bandmember_1', './assets/conversations/bandmember_1.json');
    }

    create() {
        this.scene.start('Company');
        //this.scene.start('CharacterCreation');
    }

    private createLoadingbar() {
        this.loadingBar = this.add.graphics();
        this.loadingBar.fillStyle(0x684949, 1);
        this.loadingBar.fillRect(this.camera.width / 4 - 2, this.camera.height / 2 - 18, this.camera.width / 2 + 4, 20);
        this.progressBar = this.add.graphics();
        
        this.text = this.add.text(this.camera.width / 2, this.camera.height / 2 + 25, `${this.percent}%`, {
            fontFamily: 'Octanis',
            fontSize: '2rem',
            color: '#000'
        }).setOrigin(0.5, 0.5);
    }
}
