import { BACKGROUND_HEX_COLOR, DISPLAY_SIZE } from '../constants';

const CELL_SIZE = 2;
const TRACK_HEIGHT = 16;
const BORDER_SIZE = 4;
export const COLOR_MOVE = 'color-picker-move';

export class ColorPicker extends Phaser.GameObjects.Container {
    private colors: Phaser.Types.Display.ColorObject[];
    private colorLen: number;
    private dragging: boolean = false;

    private track: Phaser.GameObjects.Sprite;
    private slider: Phaser.GameObjects.Sprite;

    constructor(scene: Phaser.Scene) {
        super(scene);
        this.colors = Phaser.Display.Color.ColorSpectrum(64);
        this.colorLen = this.colors.length;
        let g = new Phaser.GameObjects.Graphics(this.scene);
        this.drawTrack(g);
        g.lineStyle(BORDER_SIZE, 0x000000, 1);
        g.strokeRect(0, 0, this.colorLen * CELL_SIZE, TRACK_HEIGHT);
        g.generateTexture('color_picker', this.colorLen * CELL_SIZE, TRACK_HEIGHT);
        this.track = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'color_picker').setOrigin(0, 0);
        this.track.setInteractive();
        this.track.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, (e, x, y) => {
            this.onSlide(x);
        });
        this.add(this.track);

        g = new Phaser.GameObjects.Graphics(this.scene);
        g.fillStyle(0x000000, 1);
        g.fillRect(0, 0, 8, 16);
        g.generateTexture('color_slider', 8, TRACK_HEIGHT);
        this.slider = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'color_slider').setOrigin(0.5, 0);
        this.slider.setInteractive({ useHandCursor: true });
        this.add(this.slider);
        this.scene.input.setDraggable(this.slider);
        this.slider.on(Phaser.Input.Events.GAMEOBJECT_DRAG, (e, x, y) => this.onSlide(x));
    }

    private drawTrack(g: Phaser.GameObjects.Graphics) {
        for (let i = 0; i < this.colors.length; i++) {
            let color = this.colors[i];
            g.fillStyle(Phaser.Display.Color.GetColor(color.r, color.g, color.b), 1);
            g.fillRect(i * CELL_SIZE, 0, CELL_SIZE, TRACK_HEIGHT);
        }
    }

    private onSlide(x) {
        let clampX = Math.floor(Math.min(Math.max(x, 0), this.colorLen * CELL_SIZE));
        this.slider.setPosition(clampX, 0);
        let colorX = Math.floor(Math.round(clampX) / CELL_SIZE);
        let color = this.colors[Math.min(Math.max(colorX - 1, 0), this.colorLen)];
        this.emit(COLOR_MOVE, color);
    }

    public getColors() {
        return this.colors;
    }

    public setColor(color: Phaser.Types.Display.ColorObject) {
        let index = this.colors.indexOf(color);
        this.slider.setPosition(index * CELL_SIZE, 0);
        this.emit(COLOR_MOVE, color);
    }

    public setRandomColor() {
        let index = Math.min(Math.floor(Math.random() * this.colorLen), this.colorLen - 1);
        let color = this.colors[index];
        this.slider.setPosition(index * CELL_SIZE, 0);
        this.emit(COLOR_MOVE, color);
    }
}
