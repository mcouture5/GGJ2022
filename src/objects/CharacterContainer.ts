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

export interface CharacterContainerOptions {
    scene: Phaser.Scene;
    // the lowest Z-order sprite for moving stuff below it
    trailer: Phaser.GameObjects.Sprite;
    // the highest Z-order sprite for moving stuff above it
    truck: Phaser.GameObjects.RenderTexture;
    characterState: CharacterState;
    characterStates: CharacterState[];
}

export class CharacterContainer extends Phaser.GameObjects.Container {

    private truck: Phaser.GameObjects.RenderTexture;
    private trailer: Phaser.GameObjects.Sprite;
    public characterState: CharacterState;
    private characterStates: CharacterState[];
    private circle: Phaser.GameObjects.Arc;
    private passenger: Phaser.GameObjects.Sprite;
    private face: Phaser.GameObjects.RenderTexture;
    private instrumentSprite: Phaser.GameObjects.Sprite;
    private graphics: Phaser.GameObjects.Graphics;

    private isDragging: boolean;
    private angryTweenX: Phaser.Tweens.Tween;
    private preTweenX: number;
    private lonelyTimer: Phaser.Time.TimerEvent;
    private preFlipX: boolean;
    private faceTint: number;
    private angrySound: Phaser.Sound.BaseSound;
    private angrySoundTimer: Phaser.Time.TimerEvent;

    constructor(options: CharacterContainerOptions) {
        super(options.scene);

        this.truck = options.truck;
        this.trailer = options.trailer;
        this.characterState = options.characterState;
        this.characterStates = options.characterStates;

        this.isDragging = false;

        this.graphics = this.scene.add.graphics();

        this.circle = this.scene.add.circle(-5, -5, 40, 0xffffff, 0);
        this.add(this.circle);

        let faceColor = this.characterState.face.head.tint;
        let bodyColor = this.findComplementaryColor(faceColor.r, faceColor.g, faceColor.b);
        let bodyColorHex = this.rgbToHex(bodyColor.r, bodyColor.g, bodyColor.b);
        this.passenger = this.scene.add.sprite(0, 0, 'passenger').setTint(bodyColorHex);
        this.add(this.passenger);

        this.face = LoadoutGenerator.createFaceSprite(this.scene, this.characterState.face).setScale(0.1, 0.1)
            .setOrigin(0.45, 0.5);
        this.add(this.face);

        // have to keep track of instrumentSprite separately in order to boost its Z-order above the truck sprite
        let instrumentOrigin = this.instrumentToOrigin(this.characterState.instrument);
        let instrumentAngle = this.instrumentToAngle(this.characterState.instrument);
        this.instrumentSprite = this.scene.add.sprite(0, 0, this.characterState.instrument)
            .setScale(INSTRUMENT_SCALE_FACTOR, INSTRUMENT_SCALE_FACTOR)
            .setOrigin(instrumentOrigin.x, instrumentOrigin.y).setAngle(instrumentAngle);
        this.scene.children.moveAbove(this.instrumentSprite, this.truck);

        this.moveToSeatPosition(this.characterState.seatPosition);

        // add this container to the scene. move it below the trailer sprite
        this.scene.add.existing(this);
        this.scene.children.moveBelow(this, this.trailer);

        // set up angrySound only if we're the driver


        // only enable drag/drop and angrySound if not the driver
        if (!this.characterState.isDriver) {
            let angrySoundVolume = this.instrumentToAngrySoundVolume(this.characterState.instrument);
            this.angrySound = this.scene.sound.add(this.characterState.instrument + '-angry', {volume: angrySoundVolume});

            this.setInteractive({
                hitArea: new Phaser.Geom.Rectangle(-DRAG_BOX.width / 2 + DRAG_BOX.x, -DRAG_BOX.height / 2 + DRAG_BOX.x,
                    DRAG_BOX.width, DRAG_BOX.height),
                hitAreaCallback: Phaser.Geom.Rectangle.Contains,
                useHandCursor: true,
                draggable: true
            });

            this.scene.input.on('dragstart', (pointer, characterContainer: this) => {
                characterContainer.isDragging = true;
                characterContainer.stopAnimations();
                // while dragging, raise container and instrument above everything, show circle, hide body, increase
                // scale, and remove any flipping
                this.scene.children.bringToTop(characterContainer);
                this.scene.children.bringToTop(characterContainer.instrumentSprite);
                characterContainer.circle.setFillStyle(0xffffff, 1);
                characterContainer.passenger.setAlpha(0);
                characterContainer.setScale(1.5, 1.5);
                this.setFlipX(false);
            });
            this.scene.input.on('drag', (pointer, characterContainer: this, dragX: number, dragY: number) => {
                characterContainer.x = dragX;
                characterContainer.y = dragY;
            });
            this.scene.input.on('dragend', (pointer, characterContainer: this, dropped: boolean) => {
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
                // restore original Z-order, hide circle, show body, restore original scale, restore any flipping
                this.scene.children.moveBelow(characterContainer, this.trailer);
                this.scene.children.moveAbove(characterContainer.instrumentSprite, this.truck);
                characterContainer.circle.setFillStyle(0xffffff, 0);
                characterContainer.passenger.setAlpha(1);
                characterContainer.setScale(1, 1);
                if (characterContainer.characterState.seatPosition === 5) {
                    characterContainer.setFlipX(true);
                }
            });
        }
    }

    update(): void {
        this.instrumentSprite.setPosition(this.x, this.y);
        this.instrumentSprite.setScale(this.scaleX * INSTRUMENT_SCALE_FACTOR, this.scaleY * INSTRUMENT_SCALE_FACTOR);

        if (this.characterState.isAngry) {
            if (!this.isDragging && !this.angryTweenX) {
                this.preTweenX = this.x;
                this.x -= 3;
                this.angryTweenX = this.scene.add.tween({
                    targets: this,
                    x: this.preTweenX + 3,
                    ease: Phaser.Math.Easing.Elastic.Out,
                    duration: Phaser.Math.Between(100, 150),
                    yoyo: true,
                    loop: -1,
                    onComplete: () => {
                        this.x = this.preTweenX;
                    }
                });
                if (this.angrySound) {
                    this.angrySound.play();
                    this.angrySoundTimer = this.scene.time.addEvent({
                        callback: () => this.angrySound.play(),
                        delay: Phaser.Math.Between(5000, 10000),
                        loop: true
                    });
                }
                this.faceTint = 0xff7777;
                this.face.setTint(this.faceTint);
            }
        } else if (this.angryTweenX) {
            this.angryTweenX && this.angryTweenX.stop(0);
            this.angryTweenX = null;
            this.angrySoundTimer && this.angrySoundTimer.remove();
            this.angrySoundTimer = null;
            if (this.faceTint === 0xff7777) {
                this.faceTint = null;
                this.face.clearTint();
            }
        }

        if (this.characterState.isLonely) {
            if (!this.isDragging && !this.lonelyTimer) {
                this.preFlipX = this.passenger.flipX;
                this.lonelyTimer = this.scene.time.addEvent({
                    callback: () => this.toggleFlipX(),
                    delay: 2000,
                    loop: true
                });
                this.faceTint = 0x8888ff;
                this.face.setTint(this.faceTint);
            }
        } else if (this.lonelyTimer) {
            this.lonelyTimer && this.lonelyTimer.remove();
            this.lonelyTimer = null;
            this.setFlipX(this.preFlipX);
            if (this.faceTint === 0x8888ff) {
                this.faceTint = null;
                this.face.clearTint();
            }
        }

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
        this.setFlipX(false);
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
                this.x = centerX + 310;
                this.y = centerY - 20;
                this.setFlipX(true);
                break;
            default:
                throw new Error('unexpected seatPosition=' + seatPosition);
        }

        //this.y = centerY + 300;
    }

    private stopAnimations(): void {
        if (this.angryTweenX) {
            this.angryTweenX && this.angryTweenX.stop(0);
            this.angryTweenX = null;
            this.angrySoundTimer && this.angrySoundTimer.remove();
            this.angrySoundTimer = null;
        }
        if (this.lonelyTimer) {
            this.lonelyTimer && this.lonelyTimer.remove();
            this.lonelyTimer = null;
            this.setFlipX(this.preFlipX);
        }
        this.face.clearTint();
        this.faceTint = null;
    }

    private setFlipX(flipX: boolean): void {
        if (flipX) {
            this.passenger.flipX = true;
            this.face.setOrigin(0.3, 0.5);
            this.instrumentSprite.flipX = true;
            let instrumentOrigin = this.instrumentToOrigin(this.characterState.instrument, true);
            let instrumentAngle = this.instrumentToAngle(this.characterState.instrument, true);
            this.instrumentSprite.setOrigin(instrumentOrigin.x, instrumentOrigin.y).setAngle(instrumentAngle);
        } else {
            this.passenger.flipX = false;
            this.face.setOrigin(0.45, 0.5);
            this.instrumentSprite.flipX = false;
            let instrumentOrigin = this.instrumentToOrigin(this.characterState.instrument);
            let instrumentAngle = this.instrumentToAngle(this.characterState.instrument);
            this.instrumentSprite.setOrigin(instrumentOrigin.x, instrumentOrigin.y).setAngle(instrumentAngle);
        }
    }

    private toggleFlipX(): void {
        this.setFlipX(!this.passenger.flipX);
    }

    private instrumentToOrigin(instrument: TrackName, flipX?: boolean): {x: number, y: number} {
        let x: number = null;
        switch (instrument) {
            case "melodica":
                return {x: 0.5, y: -0.1};
            case "ocarina":
                x = flipX ? 0.3 : 0.7;
                return {x: x, y: -0.3};
            case "rhythm":
                return {x: 0.5, y: 0.1};
            case "uke":
                x = flipX ? 0.6 : 0.4;
                return {x: x, y: 0.2};
            case "vocal-guitar":
                x = flipX ? 0.6 : 0.4;
                return {x: x, y: 0.1};
            default:
                throw new Error('unexpected instrument=' + instrument);
        }
    }

    private instrumentToAngle(instrument: TrackName, flipX?: boolean): number {
        switch (instrument) {
            case "melodica":
            case "uke":
            case "vocal-guitar":
                return 0;
            case "ocarina":
                return flipX ? -45 : 45;
            case "rhythm":
                return flipX ? 30 : -30;
            default:
                throw new Error('unexpected instrument=' + instrument);
        }
    }

    private instrumentToAngrySoundVolume(instrument: TrackName): number {
        switch (instrument) {
            case "rhythm":
            case "melodica":
                return 0.25;
            case "uke":
            case "ocarina":
                return 0.5;
            default:
                throw new Error('unexpected instrument=' + instrument);
        }
    }

    private findComplementaryColor(r: number, g: number, b: number): {r: number, g: number, b: number} {
        return {
            r: 255 - r,
            g: 255 - g,
            b: 255 - b
        };
    }

    private rgbToHex(r: number, g: number, b: number): number {
        return (1 << 24) + (r << 16) + (g << 8) + b;
    }
}
