import { BACKGROUND_HEX_COLOR } from '../../constants';
import LoadoutGenerator, { BodyChoices, BodyPart, STARTING_TRAITS, TRAITS } from '../../LoadoutGenerator';
import Traits, { TRAIT_SELECTED } from './Traits';

const PHOTO_SCALE = 0.62;
const EDITOR_X = 475;
const EDITOR_Y = 100;
const EDITOR_SPACING = 100;
export class PhotoId extends Phaser.GameObjects.Container {
    private headEditor: IEditor;
    private hairEditor: IEditor;
    private eyebrowEditor: IEditor;
    private eyesEditor: IEditor;
    private noseEditor: IEditor;
    private mouthEditor: IEditor;

    private dayTraits: Traits;
    private nightTraits: Traits;

    private head: Phaser.GameObjects.Sprite;
    private eyebrows: Phaser.GameObjects.Sprite;
    private eyes: Phaser.GameObjects.Sprite;
    private hair: Phaser.GameObjects.Sprite;
    private mouth: Phaser.GameObjects.Sprite;
    private nose: Phaser.GameObjects.Sprite;

    private destroyables: Phaser.GameObjects.GameObject[];
    private loadout: Loadout;

    constructor(scene: Phaser.Scene, loadout: Loadout) {
        super(scene);
        this.loadout = loadout;
        this.destroyables = [];

        // Face
        let faceContainer = new Phaser.GameObjects.Container(this.scene, 16, 16);
        this.head = new Phaser.GameObjects.Sprite(this.scene, 0, 0, BodyChoices[BodyPart.head][0]).setOrigin(0, 0).setScale(PHOTO_SCALE, PHOTO_SCALE);
        this.eyebrows = new Phaser.GameObjects.Sprite(this.scene, 0, 0, BodyChoices[BodyPart.eyebrows][0]).setOrigin(0, 0).setScale(PHOTO_SCALE, PHOTO_SCALE);
        this.eyes = new Phaser.GameObjects.Sprite(this.scene, 0, 0, BodyChoices[BodyPart.eyes][0]).setOrigin(0, 0).setScale(PHOTO_SCALE, PHOTO_SCALE);
        this.hair = new Phaser.GameObjects.Sprite(this.scene, 0, 0, BodyChoices[BodyPart.hair][0]).setOrigin(0, 0).setScale(PHOTO_SCALE, PHOTO_SCALE);
        this.mouth = new Phaser.GameObjects.Sprite(this.scene, 0, 0, BodyChoices[BodyPart.mouth][0]).setOrigin(0, 0).setScale(PHOTO_SCALE, PHOTO_SCALE);
        this.nose = new Phaser.GameObjects.Sprite(this.scene, 0, 0, BodyChoices[BodyPart.nose][0]).setOrigin(0, 0).setScale(PHOTO_SCALE, PHOTO_SCALE);
        faceContainer.add([this.head, this.eyebrows, this.eyes, this.hair, this.mouth, this.nose]);
        this.add(faceContainer).destroyables.push(faceContainer);

        // Rando
        this.add(
            new Phaser.GameObjects.Zone(this.scene, 372, 17, 33, 33)
                .setOrigin(0, 0)
                .setInteractive({ useHandCursor: true })
                .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                    this.loadout.face = LoadoutGenerator.generateRandomFace();
                    this.headEditor.setValue(this.loadout.face.head);
                    this.hairEditor.setValue(this.loadout.face.hair);
                    this.eyebrowEditor.setValue(this.loadout.face.eyebrows);
                    this.eyesEditor.setValue(this.loadout.face.eyes);
                    this.noseEditor.setValue(this.loadout.face.nose);
                    this.mouthEditor.setValue(this.loadout.face.mouth);
                    this.dayTraits.setValue(Phaser.Utils.Array.GetRandom(STARTING_TRAITS));
                    this.nightTraits.setValue(Phaser.Utils.Array.GetRandom(STARTING_TRAITS));
                })
        );

        // Traits
        let traitText = new Phaser.GameObjects.Text(this.scene, 426, 73, `${this.loadout.dayTrait} / ${this.loadout.nightTrait}`, {
            fontFamily: 'Octanis',
            fontSize: '1.75rem',
            color: '#000000'
        }).setOrigin(0, 0);
        this.add(traitText).destroyables.push(traitText);
        let traitContainer = new Phaser.GameObjects.Container(this.scene, 350, 105);
        this.dayTraits = new Traits(this.scene, 'day', this.loadout).setPosition(10, 5);
        this.dayTraits.on(TRAIT_SELECTED, (trait) => {
            this.loadout.dayTrait = trait;
            traitText.setText(`${this.loadout.dayTrait} / ${this.loadout.nightTrait}`);
        })
        this.nightTraits = new Traits(this.scene, 'night', this.loadout).setPosition(10, 65);
        this.nightTraits.on(TRAIT_SELECTED, (trait) => {
            this.loadout.nightTrait = trait;
            traitText.setText(`${this.loadout.dayTrait} / ${this.loadout.nightTrait}`);
        })
        traitContainer.add([this.dayTraits, this.nightTraits]);
        this.add(traitContainer).destroyables.push(traitContainer);

        // Editors
        let editorContainer = new Phaser.GameObjects.Container(this.scene, 350, 253);
        this.headEditor = this.scene.add.editor(125, 62, this.head, BodyPart.head, this.loadout, true).setPosition(0, 0);
        this.hairEditor = this.scene.add.editor(125, 62, this.hair, BodyPart.hair, this.loadout, true).setPosition(142, 0);
        editorContainer.add([this.headEditor, this.hairEditor]);
        this.add(editorContainer).destroyables.push(editorContainer);

        // Bottom row editors
        let bottomEditorContainer = new Phaser.GameObjects.Container(this.scene, 25, 420);
        this.eyebrowEditor = this.scene.add.editor(144, 62, this.eyebrows, BodyPart.eyebrows, this.loadout).setPosition(0, 0);
        this.eyesEditor = this.scene.add.editor(125, 62, this.eyes, BodyPart.eyes, this.loadout).setPosition(162, 0);
        this.noseEditor = this.scene.add.editor(125, 62, this.nose, BodyPart.nose, this.loadout).setPosition(306, 0);
        this.mouthEditor = this.scene.add.editor(125, 62, this.mouth, BodyPart.mouth, this.loadout).setPosition(450, 0);
        bottomEditorContainer.add([this.eyebrowEditor, this.eyesEditor, this.noseEditor, this.mouthEditor]);
        this.add(bottomEditorContainer).destroyables.push(bottomEditorContainer);
    }

    public finalize() {
        this.destroyables.forEach(destroyable => destroyable.destroy());
        this.destroyables = [];

        let cover = new Phaser.GameObjects.Rectangle(this.scene, 3, 3, 623, 531, 0xfcfcfb, 1).setDepth(100).setOrigin(0, 0);
        this.add(cover);

        let face = LoadoutGenerator.createFaceSprite(this.scene, this.loadout.face).setScale(PHOTO_SCALE, PHOTO_SCALE).setPosition(16, 16).setDepth(200).setOrigin(0, 0);
        this.add(face);
        this.scene.tweens.add({
            targets: face,
            scaleX: 0.8,
            scaleY: 0.8,
            x: 107,
            duration: 1000
        });
    }
}
