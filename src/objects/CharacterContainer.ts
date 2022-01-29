import {CharacterState} from "../scenes/GameScene";
import LoadoutGenerator from "../LoadoutGenerator";
import {DISPLAY_SIZE} from "../constants";
import {TrackName} from "../MusicTracks";

const INSTRUMENT_SCALE_FACTOR = 0.25;

export class CharacterContainer extends Phaser.GameObjects.Container {

    private characterState: CharacterState;
    private instrumentSprite: Phaser.GameObjects.Sprite;

    constructor(scene: Phaser.Scene, characterState: CharacterState) {
        super(scene);

        this.characterState = characterState;

        let passenger = scene.add.sprite(0, 0, 'passenger');
        this.add(passenger);
        let face = LoadoutGenerator.createFaceSprite(scene, characterState.face).setScale(0.1, 0.1).setOrigin(0.45, 0.5);
        this.add(face);

        this.moveToSeatPosition(characterState.seatPosition);

        // have to keep track of instrumentSprite separately in order to boost its Z-order to 1000
        let instrumentOrigin = this.instrumentToOrigin(characterState.instrument);
        let instrumentAngle = this.instrumentToAngle(characterState.instrument);
        this.instrumentSprite = scene.add.sprite(0, 0, characterState.instrument).setPosition(this.x, this.y)
            .setScale(INSTRUMENT_SCALE_FACTOR, INSTRUMENT_SCALE_FACTOR)
            .setOrigin(instrumentOrigin.x, instrumentOrigin.y).setAngle(instrumentAngle).setDepth(1000);

        //this.setScale(2, 2);

        scene.add.existing(this);
    }

    update(): void {
        this.instrumentSprite.setPosition(this.x, this.y);
        this.instrumentSprite.setScale(this.scaleX * INSTRUMENT_SCALE_FACTOR, this.scaleY * INSTRUMENT_SCALE_FACTOR);
    }

    moveToSeatPosition(seatPosition: number): void {
        let centerY = DISPLAY_SIZE.height / 2;
        let centerX = DISPLAY_SIZE.width / 2;
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
