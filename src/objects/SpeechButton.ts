export interface SpeechButtonData {
    text: string;
    key: string;
}

interface SpeechButtonParams {
    scene: Phaser.Scene;
    data: SpeechButtonData;
    callback: (key: string) => void;
}

export class SpeechButton extends Phaser.GameObjects.Container {
    private buttonContainer: Phaser.GameObjects.Container;
    private speechData: SpeechButtonData;
    private callback: (key: string) => void;
    private background: Phaser.GameObjects.Rectangle;
    private textElement: Phaser.GameObjects.Text;

    constructor(params: SpeechButtonParams) {
        super(params.scene);
        this.speechData = params.data;
        this.callback = params.callback;
        this.background = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, 450, 75, 0xffffff, 1);
        this.background.setStrokeStyle(1, 0x000);
        this.background.setInteractive({ useHandCursor: true });
        this.background.on('pointerup', () => {
            this.callback(this.speechData.key);
        });
        this.textElement = new Phaser.GameObjects.Text(this.scene, 0, 0, this.speechData.text, {
            fontFamily: 'Octanis',
            fontSize: '2rem',
            color: '#000'
        }).setOrigin(0.5, 0.5);
        this.add([this.background, this.textElement]);
    }

    hide() {
        this.alpha = 0;
    }

    show() {
        this.alpha = 1;
    }

    setSpeechData(data: SpeechButtonData) {
        this.speechData = data;
    }
}
