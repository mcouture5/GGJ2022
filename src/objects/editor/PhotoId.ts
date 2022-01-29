import { BACKGROUND_HEX_COLOR } from '../../constants';
import LoadoutGenerator, { BodyChoices, BodyPart } from '../../LoadoutGenerator';

const LEFT_MARGIN = 50;
const PHOTO_X = 200;
const PHOTO_Y = 200;
const PHOTO_SCALE = 0.68;
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

    private head: Phaser.GameObjects.Sprite;
    private eyebrows: Phaser.GameObjects.Sprite;
    private eyes: Phaser.GameObjects.Sprite;
    private hair: Phaser.GameObjects.Sprite;
    private mouth: Phaser.GameObjects.Sprite;
    private nose: Phaser.GameObjects.Sprite;

    private editorContainer: Phaser.GameObjects.Container;
    private faceContainer: Phaser.GameObjects.Container;

    private loadout: Loadout;

    constructor(scene: Phaser.Scene, loadout: Loadout) {
        super(scene);
        this.loadout = loadout;
        let photoBorder = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, 570, 500, BACKGROUND_HEX_COLOR, 1).setOrigin(0, 0);
        photoBorder.setStrokeStyle(2, 0x000000, 1);
        this.add(photoBorder);

        // Face
        this.faceContainer = new Phaser.GameObjects.Container(this.scene);
        this.add(this.faceContainer);
        this.head = new Phaser.GameObjects.Sprite(this.scene, 0, 0, BodyChoices[BodyPart.head][0])
            .setPosition(PHOTO_X, PHOTO_Y)
            .setScale(PHOTO_SCALE, PHOTO_SCALE);
        this.eyebrows = new Phaser.GameObjects.Sprite(this.scene, 0, 0, BodyChoices[BodyPart.eyebrows][0])
            .setPosition(PHOTO_X, PHOTO_Y)
            .setScale(PHOTO_SCALE, PHOTO_SCALE);
        this.eyes = new Phaser.GameObjects.Sprite(this.scene, 0, 0, BodyChoices[BodyPart.eyes][0])
            .setPosition(PHOTO_X, PHOTO_Y)
            .setScale(PHOTO_SCALE, PHOTO_SCALE);
        this.hair = new Phaser.GameObjects.Sprite(this.scene, 0, 0, BodyChoices[BodyPart.hair][0])
            .setPosition(PHOTO_X, PHOTO_Y)
            .setScale(PHOTO_SCALE, PHOTO_SCALE);
        this.mouth = new Phaser.GameObjects.Sprite(this.scene, 0, 0, BodyChoices[BodyPart.mouth][0])
            .setPosition(PHOTO_X, PHOTO_Y)
            .setScale(PHOTO_SCALE, PHOTO_SCALE);
        this.nose = new Phaser.GameObjects.Sprite(this.scene, 0, 0, BodyChoices[BodyPart.nose][0])
            .setPosition(PHOTO_X, PHOTO_Y)
            .setScale(PHOTO_SCALE, PHOTO_SCALE);
        this.faceContainer.add([this.head, this.eyebrows, this.eyes, this.hair, this.mouth, this.nose]);

        // Rando
        this.add(
            new Phaser.GameObjects.Sprite(this.scene, EDITOR_X, EDITOR_Y - 40, 'dice')
                .setOrigin(0.5, 0.5)
                .setScale(0.35, 0.35)
                .setInteractive({ useHandCursor: true })
                .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                    this.loadout.face = LoadoutGenerator.generateRandomFace();
                    this.headEditor.setValue(this.loadout.face.head);
                    this.hairEditor.setValue(this.loadout.face.hair);
                    this.eyebrowEditor.setValue(this.loadout.face.eyebrows);
                    this.eyesEditor.setValue(this.loadout.face.eyes);
                    this.noseEditor.setValue(this.loadout.face.nose);
                    this.mouthEditor.setValue(this.loadout.face.mouth);
                })
        );

        // Editors
        this.editorContainer = new Phaser.GameObjects.Container(this.scene);
        this.add(this.editorContainer);
        this.headEditor = this.scene.add.editor(this.head, BodyPart.head, this.loadout, true).setPosition(EDITOR_X, EDITOR_Y + EDITOR_SPACING * 0.5);
        this.hairEditor = this.scene.add.editor(this.hair, BodyPart.hair, this.loadout, true).setPosition(EDITOR_X, EDITOR_Y + EDITOR_SPACING * 1.75);
        this.eyebrowEditor = this.scene.add
            .editor(this.eyebrows, BodyPart.eyebrows, this.loadout)
            .setPosition(EDITOR_X - 360, EDITOR_Y + EDITOR_SPACING * 3 + 20);
        this.eyesEditor = this.scene.add.editor(this.eyes, BodyPart.eyes, this.loadout).setPosition(EDITOR_X - 240, EDITOR_Y + EDITOR_SPACING * 3 + 20);
        this.noseEditor = this.scene.add.editor(this.nose, BodyPart.nose, this.loadout).setPosition(EDITOR_X - 120, EDITOR_Y + EDITOR_SPACING * 3 + 20);
        this.mouthEditor = this.scene.add.editor(this.mouth, BodyPart.mouth, this.loadout).setPosition(EDITOR_X, EDITOR_Y + EDITOR_SPACING * 3 + 20);
        this.editorContainer.add([this.headEditor, this.hairEditor, this.eyebrowEditor, this.eyesEditor, this.noseEditor, this.mouthEditor]);
    }

    public finalize() {
        this.editorContainer.destroy();
        this.faceContainer.destroy();

        let face = LoadoutGenerator.createFaceSprite(this.scene, this.loadout).setScale(PHOTO_SCALE, PHOTO_SCALE).setPosition(-42, -87);
        this.add(face);
        this.scene.tweens.add({
            targets: face,
            scaleX: 0.85,
            scaleY: 0.85,
            x: -20,
            duration: 1000
        });
    }
}
