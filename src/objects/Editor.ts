import { BACKGROUND_HEX_COLOR, BodyChoices, BodyPart, DISPLAY_SIZE } from '../constants';
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

const HEAD = ['base1', 'base2'];
const EYEBROWS = ['eyebrows1'];
const EYES = ['eyes1'];
const HAIR = ['hair1'];
const MOUTH = ['mouth1'];
const NOSE = ['nose1', 'nose2', 'nose3', 'nose4'];

interface EditorProps {
    scene: Phaser.Scene;
    sprite: Phaser.GameObjects.Sprite;
    x: number;
    y: number;
    part: BodyPart;
    loadout: Loadout;
    useColorPicker?: boolean;
}

export class Editor extends Phaser.GameObjects.Container {
    private loadout: Loadout;
    private part: BodyPart;
    private sprite: Phaser.GameObjects.Sprite;
    private colorPicker: ColorPicker;
    private index: number;

    constructor(props: EditorProps) {
        super(props.scene);
        let {x, y, sprite, part, loadout, useColorPicker} = props;
        this.loadout = loadout;
        this.part = part;
        this.sprite = sprite;
        // Starting random loadout
        this.index = this.getRandomIndex(BodyChoices[part]);
        this.sprite = new Phaser.GameObjects.Sprite(this.scene, 0, 0, BodyChoices[part][this.index]).setPosition(x, y);
        this.add(this.sprite);

        //Colorable editors
        this.createEditor('Head', EDITOR_X, EDITOR_Y + EDITOR_SPACING * 0, () => {
            this.step(HEAD, this.head, 'head');
        });

        // Color pickers
        this.headColorPicker = new ColorPicker(this.scene).setPosition(EDITOR_X - 64, EDITOR_Y + 30);
        this.add(this.headColorPicker);
        this.headColorPicker.on(COLOR_MOVE, (color: Phaser.Types.Display.ColorObject) => {
            this.head.setTint(Phaser.Display.Color.GetColor(color.r, color.g, color.b));
        });
        this.headColorPicker.setRandomColor();
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
