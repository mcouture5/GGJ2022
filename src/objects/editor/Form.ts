import LoadoutGenerator from '../../LoadoutGenerator';
import { PhotoId } from './PhotoId';

const LEFT_MARGIN = 50;

const INPUT_STYPE = {
    width: '460px',
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

export const SIGNED_EVENT = 'form-signed';

export class Form extends Phaser.GameObjects.Container {
    private nameInput: Phaser.GameObjects.DOMElement;
    private bandNameInput: Phaser.GameObjects.DOMElement;
    private nameDice: Phaser.GameObjects.Sprite;
    private bandDice: Phaser.GameObjects.Sprite;

    private photo: PhotoId;
    private loadout: Loadout;
    private signatureContainer: Phaser.GameObjects.Container;
    private signedText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, loadout: Loadout) {
        super(scene);
        this.loadout = loadout;
        let bbg = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, 700, 900, 0xff0000).setOrigin(0, 0);
        this.add(bbg);
        let bg = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'form').setOrigin(0, 0);
        bg.displayWidth = 700;
        bg.displayHeight = 900;
        this.add(bg);

        // Name
        this.add(
            new Phaser.GameObjects.Text(this.scene, LEFT_MARGIN, 85, 'Name:', {
                fontFamily: 'Octanis',
                fontSize: '2rem',
                color: '#000000'
            })
        );
        this.nameInput = new Phaser.GameObjects.DOMElement(this.scene, LEFT_MARGIN + 320, 100, '#character-name-input', INPUT_STYPE);
        this.nameInput.addListener('input');
        this.nameInput.on('input', (event) => this.onNameChange(event));
        this.add(this.nameInput);
        (document.getElementById('character-name-input') as any).value = this.loadout.name;
        this.nameDice = new Phaser.GameObjects.Sprite(this.scene, LEFT_MARGIN + 600, 100, 'dice')
            .setOrigin(0.5, 0.5)
            .setScale(0.2, 0.2)
            .setInteractive({ useHandCursor: true })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.loadout.name = LoadoutGenerator.getRandomName();
                (document.getElementById('character-name-input') as any).value = this.loadout.name;
            });
        this.add(this.nameDice);

        // Band name
        this.add(
            new Phaser.GameObjects.Text(this.scene, LEFT_MARGIN, 185, 'Band Name:', {
                fontFamily: 'Octanis',
                fontSize: '2rem',
                color: '#000000'
            })
        );
        this.bandNameInput = new Phaser.GameObjects.DOMElement(this.scene, LEFT_MARGIN + 355, 200, '#band-name-input', BAND_INPUT_STYPE);
        this.bandNameInput.addListener('input');
        this.bandNameInput.on('input', (event) => this.onBandNameChange(event));
        this.add(this.bandNameInput);
        (document.getElementById('band-name-input') as any).value = this.loadout.bandName;
        this.bandDice = new Phaser.GameObjects.Sprite(this.scene, LEFT_MARGIN + 600, 200, 'dice')
            .setOrigin(0.5, 0.5)
            .setScale(0.2, 0.2)
            .setInteractive({ useHandCursor: true })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.loadout.bandName = LoadoutGenerator.getRandomBandName();
                (document.getElementById('band-name-input') as any).value = this.loadout.bandName;
            });
        this.add(this.bandDice);

        // Photo
        this.add(
            new Phaser.GameObjects.Text(this.scene, LEFT_MARGIN, 255, 'Please attach photo ID below', {
                fontFamily: 'Octanis',
                fontSize: '1.5rem',
                color: '#000000'
            })
        );
        this.photo = new PhotoId(this.scene, this.loadout).setPosition(LEFT_MARGIN + 15, 280);
        this.add(this.photo);

        // Signature
        this.signatureContainer = new Phaser.GameObjects.Container(this.scene);
        this.add(this.signatureContainer);
        let xmark = new Phaser.GameObjects.Sprite(this.scene, LEFT_MARGIN + 25, 835, 'x').setOrigin(0.5, 0.5);
        xmark.setInteractive({ useHandCursor: true });
        xmark.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
            this.onSign();
        });
        this.signatureContainer.add(xmark);

        let sigText = new Phaser.GameObjects.Text(this.scene, LEFT_MARGIN + 120, 815, 'Sign here to begin!', {
            fontFamily: 'Octanis',
            fontSize: '2rem',
            color: '#000000'
        });
        this.signatureContainer.add(sigText);

        let underline = new Phaser.GameObjects.Graphics(this.scene);
        underline.lineStyle(2, 0x000000, 1);
        underline.moveTo(LEFT_MARGIN + 25, 855);
        underline.lineTo(600, 855);
        underline.closePath();
        underline.strokePath();
        this.add(underline);

        const arrowX = LEFT_MARGIN + 60;
        const arrowY = 830;
        let arrow = new Phaser.GameObjects.Graphics(this.scene);
        arrow.lineStyle(3, 0x000000, 1);
        arrow.moveTo(arrowX + 50, arrowY);
        arrow.lineTo(arrowX, arrowY);
        arrow.lineTo(arrowX + 15, arrowY - 15);
        arrow.moveTo(arrowX, arrowY);
        arrow.lineTo(arrowX + 15, arrowY + 15);
        arrow.strokePath();
        this.signatureContainer.add(arrow);
        document.getElementById('game').addEventListener('click', this.gameclick);
    }

    private onNameChange(event) {
        this.loadout.name = event.target.value;
    }

    private onBandNameChange(event) {
        this.loadout.bandName = event.target.value;
    }

    private onSign() {
        document.getElementById('game').removeEventListener('click', this.gameclick);
        this.nameInput.destroy();
        this.bandNameInput.destroy();
        this.nameDice.destroy();
        this.bandDice.destroy();
        this.add(
            new Phaser.GameObjects.Text(this.scene, LEFT_MARGIN + 80, 100, this.loadout.name, {
                fontFamily: 'Octanis',
                fontSize: this.getFontSize(this.loadout.name),
                color: '#000000'
            }).setOrigin(0, 0.5)
        );
        this.add(
            new Phaser.GameObjects.Text(this.scene, LEFT_MARGIN + 140, 200, this.loadout.bandName, {
                fontFamily: 'Octanis',
                fontSize: this.getFontSize(this.loadout.bandName),
                color: '#000000'
            }).setOrigin(0, 0.5)
        );
        this.photo.finalize();
        this.signatureContainer.destroy();
        this.signedText && this.signedText.destroy();
        this.signedText = new Phaser.GameObjects.Text(this.scene, LEFT_MARGIN + 45, 840, this.loadout.name, {
            fontFamily: 'Season',
            fontSize: this.getFontSize(this.loadout.name),
            color: '#000000'
        }).setOrigin(0, 0.5);
        this.add(this.signedText);
        let signed = new Phaser.GameObjects.Sprite(this.scene, 345, 400, 'signed').setOrigin(0.5, 0.5).setScale(0, 0);
        this.add(signed);
        this.scene.tweens.add({
            targets: signed,
            scaleX: 2.85,
            scaleY: 2.85,
            delay: 1000,
            duration: 400,
            onComplete: () => {
                this.scene.tweens.add({
                    targets: signed,
                    scaleX: 1.95,
                    scaleY: 1.95,
                    duration: 125,
                    onComplete: () => {
                        setTimeout(() => {
                            this.emit(SIGNED_EVENT);
                        }, 1000);
                    }
                });
            }
        });
    }

    getFontSize(text: string) {
        if (!text) return '1rem';
        if (text.length < 20) {
            return '3rem';
        }
        if (text.length < 30) {
            return '2rem';
        }
        if (text.length < 40) {
            return '1.35rem';
        }
        if (text.length < 50) {
            return '1rem';
        }
        return '0.65rem';
    }

    gameclick(e) {
        if (e.target !== document.getElementById('character-name-input') && e.target !== document.getElementById('band-name-input')) {
            try {
                document.getElementById('character-name-input').blur();
                document.getElementById('band-name-input').blur();
            } catch (err) {}
        }
    }
}
