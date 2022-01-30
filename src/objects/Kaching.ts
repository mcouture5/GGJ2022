export default class Kaching extends Phaser.GameObjects.Container {
    private coin: Phaser.Sound.BaseSound;
    constructor(scene: Phaser.Scene, amount: number, reason: string, gain?: boolean){
        super(scene, 40, 85);
        let str = `${gain ? '+' : '-'}$${amount}: ${reason}`;
        let bg = new Phaser.GameObjects.Rectangle(scene, 0, 0, str.length * 14.5, 32, 0x000000, 0.35).setOrigin(0, 0);
        this.add(bg);
        let text = new Phaser.GameObjects.Text(scene, 5, 0, '' + str, {
            fontFamily: 'Digital',
            fontSize: '2rem',
            color: gain ? '#00FF00' : '#FF0000'
        }).setOrigin(0, 0);
        this.add(text);
        this.coin = this.scene.sound.add('coin', { volume: 0.01 });
        this.coin.play();
        this.scene.add.tween({
            targets: this.coin,
            volume: {from: 0.01, to: 0},
            ease: 'Linear',
            duration: 450
        });

        this.scene.tweens.add({
            targets: this,
            y: 125,
            alpha: 0,
            delay: 1500,
            duration: 500,
            onComplete: () => {
                this.destroy();
            }
        });
    }
}
