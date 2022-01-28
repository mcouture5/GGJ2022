export const BUTTON_CLICKED = 'button-clicked';

export default class Button extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene, label: string) {
        super(scene);
        let button = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, label.length * 13.5, 45, 0xffffff, 1);
        button.setStrokeStyle(2, 0x000000);
        button.setInteractive({ useHandCursor: true });
        button.on('pointerup', () => {
            this.emit(BUTTON_CLICKED);
        });
        let text = new Phaser.GameObjects.Text(this.scene, 0, 0, label, {
            fontFamily: 'Octanis',
            fontSize: '1.5rem',
            color: '#000'
        }).setOrigin(0.5, 0.5);
        this.add(button);
        this.add(text);
    }
}
