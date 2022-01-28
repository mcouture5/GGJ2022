import { BACKGROUND_HEX_COLOR, DISPLAY_SIZE } from '../constants';
import { Loadout } from '../scenes/CharacterCreation';
import { ColorPicker, COLOR_MOVE } from './ColorPicker';

const LEFT_MARGIN = 50;
const PHOTO_X = 250;
const PHOTO_Y = 570;
const PHOTO_SCALE = 0.68;
const EDITOR_X = 550;
const EDITOR_Y = 450;
const EDITOR_SPACING = 100;
const BUTTON_HEIGHT = 45;

const INPUT_STYPE = {
    width: '480px',
    height: '42px',
    font: '2rem Octanis',
    padding: '6px'
};

const BAND_INPUT_STYPE = {
    width: '410px',
    height: '42px',
    font: '2rem Octanis',
    padding: '6px'
};

export class Form extends Phaser.GameObjects.Container {
    private head: Phaser.GameObjects.Sprite;
    private eyebrows: Phaser.GameObjects.Sprite;
    private eyes: Phaser.GameObjects.Sprite;
    private hair: Phaser.GameObjects.Sprite;
    private mouth: Phaser.GameObjects.Sprite;
    private nose: Phaser.GameObjects.Sprite;

    private headColorPicker: ColorPicker;
    private hairColorPicker: ColorPicker;
    private eyeColorPicker: ColorPicker;

    private indexes = { head: 0, eyebrows: 0, eyes: 0, hair: 0, mouth: 0, nose: 0 };

    constructor(scene: Phaser.Scene, loadout: Loadout) {
        super(scene);
        let bbg = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, 700, 900, 0xff0000).setOrigin(0, 0);
        this.add(bbg);
        let bg = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'form').setOrigin(0, 0);
        bg.displayWidth = 700;
        bg.displayHeight = 900;
        this.add(bg);

        // Name
        this.add(
            new Phaser.GameObjects.Text(this.scene, LEFT_MARGIN, 100, 'Name:', {
                fontFamily: 'Octanis',
                fontSize: '2rem',
                color: '#000000'
            })
        );
        let nameInput = new Phaser.GameObjects.DOMElement(this.scene, LEFT_MARGIN + 320, 115, 'input', INPUT_STYPE);
        nameInput.addListener('input');
        nameInput.on('input', (event) => this.onNameChange(event));
        this.add(nameInput);

        // Band name
        this.add(
            new Phaser.GameObjects.Text(this.scene, LEFT_MARGIN, 200, 'Band Name:', {
                fontFamily: 'Octanis',
                fontSize: '2rem',
                color: '#000000'
            })
        );
        let bandNameInput = new Phaser.GameObjects.DOMElement(this.scene, LEFT_MARGIN + 355, 215, 'input', BAND_INPUT_STYPE);
        bandNameInput.addListener('input');
        bandNameInput.on('input', (event) => this.onBandNameChange(event));
        this.add(bandNameInput);

        // Photo
        this.add(
            new Phaser.GameObjects.Text(this.scene, LEFT_MARGIN, 300, 'Please attach photo ID below', {
                fontFamily: 'Octanis',
                fontSize: '2rem',
                color: '#000000'
            })
        );
        let photoBorder = new Phaser.GameObjects.Rectangle(this.scene, LEFT_MARGIN, 350, 600, 500, BACKGROUND_HEX_COLOR, 1).setOrigin(0, 0);
        photoBorder.setStrokeStyle(2, 0x000000, 1);
        this.add(photoBorder);

        // Starting random loadout
        this.indexes.head = this.getRandomIndex(HEAD);
        this.indexes.eyebrows = this.getRandomIndex(EYEBROWS);
        this.indexes.eyes = this.getRandomIndex(EYES);
        this.indexes.hair = this.getRandomIndex(HAIR);
        this.indexes.mouth = this.getRandomIndex(MOUTH);
        this.indexes.nose = this.getRandomIndex(NOSE);

        this.head = new Phaser.GameObjects.Sprite(this.scene, 0, 0, HEAD[this.indexes.head]).setPosition(PHOTO_X, PHOTO_Y).setScale(PHOTO_SCALE, PHOTO_SCALE);
        this.eyebrows = new Phaser.GameObjects.Sprite(this.scene, 0, 0, EYEBROWS[this.indexes.eyebrows])
            .setPosition(PHOTO_X, PHOTO_Y)
            .setScale(PHOTO_SCALE, PHOTO_SCALE);
        this.eyes = new Phaser.GameObjects.Sprite(this.scene, 0, 0, EYES[this.indexes.eyes]).setPosition(PHOTO_X, PHOTO_Y).setScale(PHOTO_SCALE, PHOTO_SCALE);
        this.hair = new Phaser.GameObjects.Sprite(this.scene, 0, 0, HAIR[this.indexes.hair]).setPosition(PHOTO_X, PHOTO_Y).setScale(PHOTO_SCALE, PHOTO_SCALE);
        this.mouth = new Phaser.GameObjects.Sprite(this.scene, 0, 0, MOUTH[this.indexes.mouth])
            .setPosition(PHOTO_X, PHOTO_Y)
            .setScale(PHOTO_SCALE, PHOTO_SCALE);
        this.nose = new Phaser.GameObjects.Sprite(this.scene, 0, 0, NOSE[this.indexes.nose]).setPosition(PHOTO_X, PHOTO_Y).setScale(PHOTO_SCALE, PHOTO_SCALE);
        this.add(this.head);
        this.add(this.eyebrows);
        this.add(this.eyes);
        this.add(this.hair);
        this.add(this.mouth);
        this.add(this.nose);

        //Colorable editors
        this.createEditor('Head', EDITOR_X, EDITOR_Y + EDITOR_SPACING * 0, () => {
            this.step(HEAD, this.head, 'head');
        });
        this.createEditor('Hair', EDITOR_X, EDITOR_Y + EDITOR_SPACING * 1, () => {
            this.step(HAIR, this.hair, 'hair');
        });
        this.createEditor('Eyes', EDITOR_X, EDITOR_Y + EDITOR_SPACING * 2, () => {
            this.step(EYES, this.eyes, 'eyes');
        });

        // Static editors
        this.createEditor('Eyebrows', EDITOR_X - 240, EDITOR_Y + EDITOR_SPACING * 3 + 20, () => {
            this.step(EYEBROWS, this.eyebrows, 'eyebrows');
        });
        this.createEditor('Nose', EDITOR_X - 120, EDITOR_Y + EDITOR_SPACING * 3 + 20, () => {
            this.step(NOSE, this.nose, 'nose');
        });
        this.createEditor('Mouth', EDITOR_X, EDITOR_Y + EDITOR_SPACING * 3 + 20, () => {
            this.step(MOUTH, this.mouth, 'mouth');
        });

        // Color pickers
        this.headColorPicker = new ColorPicker(this.scene).setPosition(EDITOR_X - 64, EDITOR_Y + 30);
        this.add(this.headColorPicker);
        this.headColorPicker.on(COLOR_MOVE, (color: Phaser.Types.Display.ColorObject) => {
            this.head.setTint(Phaser.Display.Color.GetColor(color.r, color.g, color.b));
        });
        this.headColorPicker.setRandomColor();

        this.hairColorPicker = new ColorPicker(this.scene).setPosition(EDITOR_X - 64, EDITOR_Y + EDITOR_SPACING * 1 + 30);
        this.add(this.hairColorPicker);
        this.hairColorPicker.on(COLOR_MOVE, (color: Phaser.Types.Display.ColorObject) => {
            this.hair.setTint(Phaser.Display.Color.GetColor(color.r, color.g, color.b));
        });
        this.hairColorPicker.setRandomColor();

        this.eyeColorPicker = new ColorPicker(this.scene).setPosition(EDITOR_X - 64, EDITOR_Y + EDITOR_SPACING * 2 + 30);
        this.add(this.eyeColorPicker);
        this.eyeColorPicker.on(COLOR_MOVE, (color: Phaser.Types.Display.ColorObject) => {
            this.eyes.setTint(Phaser.Display.Color.GetColor(color.r, color.g, color.b));
        });
        this.eyeColorPicker.setRandomColor();
    }

    private onNameChange(event) {
        console.log(event.target.value);
    }

    private onBandNameChange(event) {
        console.log(event.target.value);
    }

    private getRandomIndex(arr: any[]) {
        return Math.min(Math.floor(Math.random() * arr.length), arr.length - 1);
    }

    private step(arr: any[], sprite: Phaser.GameObjects.Sprite, part: string) {
        let index = this.indexes[part];
        index++;
        console.log(index, this.indexes, arr);
        if (index >= arr.length) {
            index = 0;
            console.log(index, this.indexes, arr);
        }
        this.indexes[part] = index;
        sprite.setTexture(arr[index]);
    }

    private createEditor(name: string, x: number, y: number, callback: () => void) {
        let button = new Phaser.GameObjects.Rectangle(this.scene, x, y, 100, BUTTON_HEIGHT, 0xffffff, 1);
        button.setStrokeStyle(2, 0x000000);
        button.setInteractive({ useHandCursor: true });
        button.on('pointerup', () => {
            callback();
        });
        this.add(button);
        let text = new Phaser.GameObjects.Text(this.scene, x, y, name, {
            fontFamily: 'Octanis',
            fontSize: '1.5rem',
            color: '#000'
        }).setOrigin(0.5, 0.5);
        this.add(text);
    }
}
