import LoadoutGenerator, { BodyChoices, BodyPart } from '../../LoadoutGenerator';
import { ColorPicker, COLOR_MOVE } from './ColorPicker';

export class Editor extends Phaser.GameObjects.Container implements IEditor {
    private loadout: Loadout;
    private part: BodyPart;
    private sprite: Phaser.GameObjects.Sprite;
    private colorPicker: ColorPicker;
    private index: number;
    private choices: string[];
    private texture: string;
    private text: Phaser.GameObjects.Text;
    private numbers: Phaser.GameObjects.Text[];

    constructor(scene: Phaser.Scene, w: number, h: number, sprite: Phaser.GameObjects.Sprite, part: BodyPart, loadout: Loadout, useColorPicker: boolean = false) {
        super(scene);
        this.loadout = loadout;
        this.part = part;
        this.sprite = sprite;
        this.choices = BodyChoices[part];
        this.numbers = [];

        // Button
        let button = new Phaser.GameObjects.Zone(this.scene, 0, 0, w, h).setOrigin(0, 0);
        button.setInteractive({ useHandCursor: true });
        button.on('pointerup', () => {
            this.step();
        });
        this.add(button);

        // Reference numbers
        for (let i = 0; i < this.choices.length; i++) {
            let text = new Phaser.GameObjects.Text(this.scene, 5 + i * 17, h + 5, '' + (i + 1), {
                fontFamily: 'Octanis',
                fontSize: '1rem',
                color: '#CCCCCC'
            }).setOrigin(0, 0);
            text.setInteractive({ useHandCursor: true });
            text.on('pointerup', () => {
                this.index = i;
                this.setTexture();
                this.updateSprite();
            });
            this.add(text).numbers.push(text);
        }

        // Color picker
        if (useColorPicker) {
            this.colorPicker = new ColorPicker(this.scene).setPosition(-1, h + 27);
            this.add(this.colorPicker);
            this.colorPicker.on(COLOR_MOVE, (color: Phaser.Types.Display.ColorObject) => {
                this.sprite.setTint(LoadoutGenerator.getTint(color));
                this.loadout.face[this.part].tint = color;
            });
        }
        
        // Set values from the loadout
        this.setValue(this.loadout.face[part]);
    }

    public setValue(part: FacePart) {
        // Textute
        this.texture = part.texture;
        this.index = this.choices.indexOf(this.texture);
        this.updateSprite();

        // Tint
        if (part.tint) {
            this.sprite.setTint(LoadoutGenerator.getTint(part.tint));
            this.colorPicker.setColor(part.tint);
        }
    }

    private step() {
        this.index++;
        if (this.index >= this.choices.length) {
            this.index = 0;
        }
        this.setTexture();
        this.updateSprite();
    }

    private setTexture() {
        this.texture = this.choices[this.index];
        this.loadout.face[this.part].texture = this.texture;
    }

    private updateSprite() {
        this.sprite.setTexture(this.texture);
        this.numbers.forEach((text) => text.setStyle({ color: '#CCCCCC' }));
        this.numbers[this.index].setStyle({ color: '#000000' });
    }
}
