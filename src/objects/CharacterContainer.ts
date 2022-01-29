import {CharacterState} from "../scenes/GameScene";
import LoadoutGenerator from "../LoadoutGenerator";
import {DISPLAY_SIZE} from "../constants";

export class CharacterContainer extends Phaser.GameObjects.Container {

    private characterState: CharacterState;

    constructor(scene: Phaser.Scene, characterState: CharacterState) {
        super(scene);

        this.characterState = characterState;

        let passenger = scene.add.sprite(0, 0, 'passenger');
        this.add(passenger);
        let face = LoadoutGenerator.createFaceSprite(scene, characterState.face).setScale(0.1, 0.1).setOrigin(0.45, 0.5);
        this.add(face);
        let instrument = scene.add.sprite(0, 0, characterState.instrument).setScale(0.25, 0.25);
        this.add(instrument);

        let centerY = DISPLAY_SIZE.height / 2;
        this.y = centerY - 35;
        this.moveToSeatPosition(characterState.seatPosition);

        scene.add.existing(this);
    }

    moveToSeatPosition(seatPosition: number): void {
        let centerX = DISPLAY_SIZE.width / 2;
        switch (seatPosition) {
            case 1:
                this.x = centerX - 280;
                break;
            case 2:
                this.x = centerX - 220;
                break;
            case 3:
                this.x = centerX - 120;
                break;
            case 4:
                this.x = centerX - 50;
                break;
            case 5:
                this.x = centerX + 340;
                break;
        }
    }
}
