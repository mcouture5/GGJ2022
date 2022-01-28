import { BodyChoices, BodyPart } from '../../LoadoutGenerator';
import { ColorPicker, COLOR_MOVE } from './ColorPicker';

export class Editor extends Phaser.GameObjects.Container {
    private loadout: Loadout;
    private part: BodyPart;
    private sprite: Phaser.GameObjects.Sprite;
    private colorPicker: ColorPicker;
    private index: number;
    private choices: string[];
    private texture: string;
    private text: Phaser.GameObjects.Text;
    private numbers: Phaser.GameObjects.Text[];

    constructor(scene: Phaser.Scene, sprite: Phaser.GameObjects.Sprite, part: BodyPart, loadout: Loadout, useColorPicker: boolean = false) {
        super(scene);
        this.loadout = loadout;
        this.part = part;
        this.sprite = sprite;
        // Starting random loadout
        this.choices = BodyChoices[part];
        this.index = this.getRandomIndex();
        this.texture = this.choices[this.index];
        this.sprite.setTexture(this.texture);
        this.loadout.face[part].texture = this.texture;
        this.numbers = [];

        // Button
        let button = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, 100, 50, 0xffffff, 1);
        button.setStrokeStyle(2, 0x000000);
        button.setInteractive({ useHandCursor: true });
        button.on('pointerup', () => {
            this.step();
        });
        this.add(button);
        this.text = new Phaser.GameObjects.Text(this.scene, 0, 5, this.part, {
            fontFamily: 'Octanis',
            fontSize: '1.5rem',
            color: '#000'
        }).setOrigin(0.5, 0.5);
        this.add(this.text);

        // Reference numbers
        for (let i = 0; i < this.choices.length; i++) {
            let color = this.index === i ? '#000000' : '#CCCCCC';
            let text = new Phaser.GameObjects.Text(this.scene, -40 + i * 14.5, -5, '' + (i + 1), {
                fontFamily: 'Octanis',
                fontSize: '0.80rem',
                color: color
            }).setOrigin(1, 1);
            this.add(text);
            this.numbers.push(text);
        }

        // Color picker
        if (useColorPicker) {
            this.colorPicker = new ColorPicker(this.scene).setPosition(-64, 30);
            this.add(this.colorPicker);
            this.colorPicker.on(COLOR_MOVE, (color: Phaser.Types.Display.ColorObject) => {
                let colorNum = Phaser.Display.Color.GetColor(color.r, color.g, color.b);
                this.loadout.face[this.part].tint = colorNum;
                this.sprite.setTint(colorNum);
            });
            this.colorPicker.setRandomColor();
        }
    }

    private getRandomIndex() {
        return Math.min(Math.floor(Math.random() * this.choices.length), this.choices.length - 1);
    }

    private step() {
        this.index++;
        if (this.index >= this.choices.length) {
            this.index = 0;
        }
        this.texture = this.choices[this.index];
        this.sprite.setTexture(this.texture);
        this.loadout.face[this.part].texture = this.texture;
        this.numbers.forEach((text) => text.setStyle({ color: '#CCCCCC' }));
        this.numbers[this.index].setStyle({ color: '#000000' });
    }
}
