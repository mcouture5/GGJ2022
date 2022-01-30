export default class Kaching extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene, x: number, y: number, amount: number, gain?: boolean){
        super(scene, x, y);
        let str = (gain ? '+' : '-') + '$' + amount;
        let bg = new Phaser.GameObjects.Rectangle(scene, 0, 0, str.length * 16, 32, 0x000000, 0.35).setOrigin(0, 0);
        this.add(bg);
        let text = new Phaser.GameObjects.Text(scene, 5, 0, '' + str, {
            fontFamily: 'Digital',
            fontSize: '2rem',
            color: gain ? '#00FF00' : '#FF0000'
        }).setOrigin(0, 0);
        this.add(text);
        this.scene.tweens.add({
            targets: this,
            y: gain ? y - 50 : y + 50,
            alpha: 0,
            delay: 500,
            duration: 500,
            onComplete: () => {
                this.destroy();
            }
        });
    }
}
