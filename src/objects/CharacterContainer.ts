import {CharacterState} from "../scenes/GameScene";
import LoadoutGenerator from "../LoadoutGenerator";
import {DISPLAY_SIZE} from "../constants";
import {TrackName} from "../MusicTracks";

const INSTRUMENT_SCALE_FACTOR = 0.25;
const DRAG_BOX = {x: -5, y: -5, width: 55, height: 80};
// drop zone X/Y are the left-top corner position, relative to screen center
const SEAT_1_DROP_ZONE = {x: -497, y: -100, width: 240, height: 220};
const SEAT_2_DROP_ZONE = {x: -256, y: -100, width: 86, height: 220};
const SEAT_3_DROP_ZONE = {x: -168, y: -100, width: 78, height: 220};
const SEAT_4_DROP_ZONE = {x: -89, y: -100, width: 120, height: 220};
const SEAT_5_DROP_ZONE = {x: 100, y: -100, width: 350, height: 220};

export class CharacterContainer extends Phaser.GameObjects.Container {

    private characterState: CharacterState;
    private characterStates: CharacterState[];
    private instrumentSprite: Phaser.GameObjects.Sprite;
    private graphics: Phaser.GameObjects.Graphics;

    private isDragging: boolean;

    constructor(scene: Phaser.Scene, characterState: CharacterState, characterStates: CharacterState[]) {
        super(scene);

        this.characterState = characterState;
        this.characterStates = characterStates;

        this.isDragging = false;

        this.graphics = scene.add.graphics();

        let passenger = scene.add.sprite(0, 0, 'passenger');
        this.add(passenger);
        let face = LoadoutGenerator.createFaceSprite(scene, characterState.face).setScale(0.1, 0.1)
            .setOrigin(0.45, 0.5);
        this.add(face);

        this.moveToSeatPosition(characterState.seatPosition);

        // have to keep track of instrumentSprite separately in order to boost its Z-order to 1000
        let instrumentOrigin = this.instrumentToOrigin(characterState.instrument);
        let instrumentAngle = this.instrumentToAngle(characterState.instrument);
        this.instrumentSprite = scene.add.sprite(0, 0, characterState.instrument).setPosition(this.x, this.y)
            .setScale(INSTRUMENT_SCALE_FACTOR, INSTRUMENT_SCALE_FACTOR)
            .setOrigin(instrumentOrigin.x, instrumentOrigin.y).setAngle(instrumentAngle).setDepth(1000);

        scene.add.existing(this);

        // only enable dragging and dropping if not the driver
        if (!this.characterState.isDriver) {
            this.setInteractive({
                hitArea: new Phaser.Geom.Rectangle(-DRAG_BOX.width / 2 + DRAG_BOX.x, -DRAG_BOX.height / 2 + DRAG_BOX.x,
                    DRAG_BOX.width, DRAG_BOX.height),
                hitAreaCallback: Phaser.Geom.Rectangle.Contains,
                useHandCursor: true,
                draggable: true
            });

            scene.input.on('dragstart', (pointer, characterContainer: this) => {
                characterContainer.isDragging = true;
            });
            scene.input.on('drag', (pointer, characterContainer: this, dragX: number, dragY: number) => {
                characterContainer.x = dragX;
                characterContainer.y = dragY;
            });
            scene.input.on('dragend', (pointer, characterContainer: this, dropped: boolean) => {
                // 'dragend' has tons of duplicate events. STOP if we've already handled this.
                if (!characterContainer.isDragging) {
                    return;
                }

                let centerX = DISPLAY_SIZE.width / 2;
                let centerY = DISPLAY_SIZE.height / 2;
                if (new Phaser.Geom.Rectangle(centerX + SEAT_1_DROP_ZONE.x, centerY + SEAT_1_DROP_ZONE.y,
                        SEAT_1_DROP_ZONE.width, SEAT_1_DROP_ZONE.height).contains(pointer.x, pointer.y) &&
                        characterContainer.seatPositionIsOpen(1)) {
                    characterContainer.moveToSeatPosition(1);
                } else if (new Phaser.Geom.Rectangle(centerX + SEAT_2_DROP_ZONE.x, centerY + SEAT_2_DROP_ZONE.y,
                        SEAT_2_DROP_ZONE.width, SEAT_2_DROP_ZONE.height).contains(pointer.x, pointer.y) &&
                        characterContainer.seatPositionIsOpen(2)) {
                    characterContainer.moveToSeatPosition(2);
                } else if (new Phaser.Geom.Rectangle(centerX + SEAT_3_DROP_ZONE.x, centerY + SEAT_3_DROP_ZONE.y,
                        SEAT_3_DROP_ZONE.width, SEAT_3_DROP_ZONE.height).contains(pointer.x, pointer.y) &&
                        characterContainer.seatPositionIsOpen(3)) {
                    characterContainer.moveToSeatPosition(3);
                } else if (new Phaser.Geom.Rectangle(centerX + SEAT_4_DROP_ZONE.x, centerY + SEAT_4_DROP_ZONE.y,
                        SEAT_4_DROP_ZONE.width, SEAT_4_DROP_ZONE.height).contains(pointer.x, pointer.y) &&
                        characterContainer.seatPositionIsOpen(4)) {
                    characterContainer.moveToSeatPosition(4);
                } else if (new Phaser.Geom.Rectangle(centerX + SEAT_5_DROP_ZONE.x, centerY + SEAT_5_DROP_ZONE.y,
                        SEAT_5_DROP_ZONE.width, SEAT_5_DROP_ZONE.height).contains(pointer.x, pointer.y) &&
                        characterContainer.seatPositionIsOpen(5)) {
                    characterContainer.moveToSeatPosition(5);
                } else {
                    characterContainer.x = characterContainer.input.dragStartX;
                    characterContainer.y = characterContainer.input.dragStartY;
                }

                characterContainer.isDragging = false;
            });
        }
    }

    update(): void {
        this.instrumentSprite.setPosition(this.x, this.y);
        this.instrumentSprite.setScale(this.scaleX * INSTRUMENT_SCALE_FACTOR, this.scaleY * INSTRUMENT_SCALE_FACTOR);

        // DEBUG BOUNDING BOXES
        let debug = false;
        if (debug) {
            let centerX = DISPLAY_SIZE.width / 2;
            let centerY = DISPLAY_SIZE.height / 2;
            this.graphics.clear();
            this.graphics.lineStyle(2, 0xffff00);
            this.graphics.strokeRect(this.x - DRAG_BOX.width / 2 + DRAG_BOX.x,
                this.y - DRAG_BOX.height / 2 + DRAG_BOX.y, DRAG_BOX.width, DRAG_BOX.height);
            this.graphics.strokeRect(centerX + SEAT_1_DROP_ZONE.x, centerY + SEAT_1_DROP_ZONE.y,
                SEAT_1_DROP_ZONE.width, SEAT_1_DROP_ZONE.height);
            this.graphics.strokeRect(centerX + SEAT_2_DROP_ZONE.x, centerY + SEAT_2_DROP_ZONE.y,
                SEAT_2_DROP_ZONE.width, SEAT_2_DROP_ZONE.height);
            this.graphics.strokeRect(centerX + SEAT_3_DROP_ZONE.x, centerY + SEAT_3_DROP_ZONE.y,
                SEAT_3_DROP_ZONE.width, SEAT_3_DROP_ZONE.height);
            this.graphics.strokeRect(centerX + SEAT_4_DROP_ZONE.x, centerY + SEAT_4_DROP_ZONE.y,
                SEAT_4_DROP_ZONE.width, SEAT_4_DROP_ZONE.height);
            this.graphics.strokeRect(centerX + SEAT_5_DROP_ZONE.x, centerY + SEAT_5_DROP_ZONE.y,
                SEAT_5_DROP_ZONE.width, SEAT_5_DROP_ZONE.height);
        }
    }

    seatPositionIsOpen(seatPosition: number): boolean {
        for (let characterState of this.characterStates) {
            if (characterState.seatPosition === seatPosition) {
                return false;
            }
        }
        return true;
    }

    moveToSeatPosition(seatPosition: number): void {
        this.characterState.seatPosition = seatPosition;

        let centerX = DISPLAY_SIZE.width / 2;
        let centerY = DISPLAY_SIZE.height / 2;
        switch (seatPosition) {
            case 1:
                this.x = centerX - 280;
                this.y = centerY - 35;
                break;
            case 2:
                this.x = centerX - 220;
                this.y = centerY - 35;
                break;
            case 3:
                this.x = centerX - 120;
                this.y = centerY - 35;
                break;
            case 4:
                this.x = centerX - 50;
                this.y = centerY - 35;
                break;
            case 5:
                this.x = centerX + 330;
                this.y = centerY - 20;
                break;
        }

        //this.y = centerY + 300;
    }

    private instrumentToOrigin(instrument: TrackName): {x: number, y: number} {
        switch (instrument) {
            case "melodica":
                return {x: 0.5, y: -0.1};
            case "ocarina":
                return {x: 0.7, y: -0.3};
            case "rhythm":
                return {x: 0.5, y: 0.1};
            case "uke":
                return {x: 0.4, y: 0.2};
            case "vocal-guitar":
                return {x: 0.4, y: 0.1};
            default:
                throw new Error('unexpected instrument=' + instrument);
        }
    }

    private instrumentToAngle(instrument: TrackName): number {
        switch (instrument) {
            case "melodica":
            case "uke":
            case "vocal-guitar":
                return 0;
            case "ocarina":
                return 45;
            case "rhythm":
                return -30;
            default:
                throw new Error('unexpected instrument=' + instrument);
        }
    }
}
