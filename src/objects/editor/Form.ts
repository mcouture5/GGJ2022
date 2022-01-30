import LoadoutGenerator from '../../LoadoutGenerator';
import { PhotoId } from './PhotoId';

const LEFT_MARGIN = 34;

export const SIGNED_EVENT = 'form-signed';

export class Form extends Phaser.GameObjects.Container {
    private nameInput: Phaser.GameObjects.DOMElement;
    private bandNameInput: Phaser.GameObjects.DOMElement;
    private destroyables: Phaser.GameObjects.GameObject[];

    private photo: PhotoId;
    private loadout: Loadout;

    constructor(scene: Phaser.Scene, loadout: Loadout) {
        super(scene);
        this.loadout = loadout;
        this.destroyables = [];
        let bg = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'contract').setOrigin(0, 0);
        bg.displayWidth = 700;
        bg.displayHeight = 900;
        this.add(bg);

        // Name
        this.nameInput = new Phaser.GameObjects.DOMElement(this.scene, 184, 109, '#character-name-input').setOrigin(0, 0);
        this.nameInput.addListener('input');
        this.nameInput.on('input', (event) => this.onNameChange(event));
        this.add(this.nameInput).destroyables.push(this.nameInput);
        (document.getElementById('character-name-input') as any).value = this.loadout.name;
        let nameDiceZone = new Phaser.GameObjects.Zone(this.scene, 619, 109, 33, 33)
            .setOrigin(0, 0)
            .setInteractive({ useHandCursor: true })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.loadout.name = LoadoutGenerator.getRandomName();
                (document.getElementById('character-name-input') as any).value = this.loadout.name;
            });
        this.add(nameDiceZone).destroyables.push(nameDiceZone);

        // Band name
        this.bandNameInput = new Phaser.GameObjects.DOMElement(this.scene, 184, 166, '#band-name-input').setOrigin(0, 0);
        this.bandNameInput.addListener('input');
        this.bandNameInput.on('input', (event) => this.onBandNameChange(event));
        this.add(this.bandNameInput).destroyables.push(this.bandNameInput);
        (document.getElementById('band-name-input') as any).value = this.loadout.bandName;
        let bandDiceZone = new Phaser.GameObjects.Zone(this.scene, 619, 168, 33, 33)
            .setOrigin(0, 0)
            .setInteractive({ useHandCursor: true })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.loadout.bandName = LoadoutGenerator.getRandomBandName();
                (document.getElementById('band-name-input') as any).value = this.loadout.bandName;
            });
        this.add(bandDiceZone).destroyables.push(bandDiceZone);

        // Photo
        this.photo = new PhotoId(this.scene, this.loadout).setPosition(35, 259);
        this.add(this.photo);

        // Signature
        let signHere = new Phaser.GameObjects.Sprite(this.scene, 47, 817, 'signhere').setOrigin(0, 0);
        signHere.setInteractive({ useHandCursor: true });
        signHere.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
            this.onSign();
        });
        this.add(signHere).destroyables.push(signHere);
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
        this.destroyables.forEach(destroyable => destroyable.destroy());
        this.destroyables = [];
        this.add(
            new Phaser.GameObjects.Text(this.scene, 187, 113, this.loadout.name, {
                fontFamily: 'Octanis',
                fontSize: this.getFontSize(this.loadout.name),
                color: '#000000'
            }).setOrigin(0, 0)
        );
        this.add(
            new Phaser.GameObjects.Text(this.scene, 187, 169, this.loadout.bandName, {
                fontFamily: 'Octanis',
                fontSize: this.getFontSize(this.loadout.bandName),
                color: '#000000'
            }).setOrigin(0, 0)
        );
        this.photo.finalize();
        let signedText = new Phaser.GameObjects.Text(this.scene, LEFT_MARGIN + 45, 840, this.loadout.name, {
            fontFamily: 'Season',
            fontSize: this.getSigFontSize(this.loadout.name),
            color: '#000000'
        }).setOrigin(0, 0.5);
        this.add(signedText);
        let signed = new Phaser.GameObjects.Sprite(this.scene, 345, 400, 'signed').setOrigin(0.5, 0.5).setScale(0, 0).setRotation(-0.3);
        this.add(signed);
        this.scene.tweens.add({
            targets: signed,
            scaleX: 0.55,
            scaleY: 0.55,
            delay: 1000,
            duration: 400,
            onComplete: () => {
                this.scene.tweens.add({
                    targets: signed,
                    scaleX: 0.25,
                    scaleY: 0.25,
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
    
    getSigFontSize(text: string) {
        if (!text) return '1rem';
        if (text.length < 30) {
            return '2.8rem';
        }
        if (text.length < 40) {
            return '2.35rem';
        }
        if (text.length < 50) {
            return '1.2rem';
        }
        return '0.95rem';
    }

    getFontSize(text: string) {
        if (!text) return '1rem';
        if (text.length < 30) {
            return '1.8rem';
        }
        if (text.length < 40) {
            return '1.35rem';
        }
        if (text.length < 50) {
            return '0.85rem';
        }
        return '0.6rem';
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
