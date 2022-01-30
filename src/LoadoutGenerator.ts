import { uniqueNamesGenerator, Config, adjectives, colors, animals } from 'unique-names-generator';
import {CharacterState} from "./scenes/GameScene";
import {TrackName} from "./MusicTracks";
import { NAMES } from './names';

export enum BodyPart {
    'head' = 'head',
    'hair' = 'hair',
    'eyebrows' = 'eyebrows',
    'eyes' = 'eyes',
    'nose' = 'nose',
    'mouth' = 'mouth'
}

export const BodyChoices = {
    [BodyPart.head]: ['base1', 'base2'],
    [BodyPart.hair]: ['hair1', 'hair2', 'hair3', 'hair4', 'hair5', 'hair6'],
    [BodyPart.eyebrows]: ['eyebrows1', 'eyebrows2', 'eyebrows3', 'eyebrows4', 'eyebrows5', 'eyebrows6', 'eyebrows7'],
    [BodyPart.eyes]: ['eyes1', 'eyes2', 'eyes3', 'eyes4', 'eyes5', 'eyes6', 'eyes7'],
    [BodyPart.nose]: ['nose1', 'nose2', 'nose3', 'nose4'],
    [BodyPart.mouth]: ['mouth1', 'mouth2', 'mouth3', 'mouth4']
};

export const TRAITS = ['hat', 'safety', 'scary', 'party', 'hungry', 'friendly', 'fast', 'slippery'];
export const STARTING_TRAITS = Phaser.Utils.Array.Shuffle([...TRAITS]).slice(0, 4);
export const SKILLS = ['hammer', 'screwdriver', 'wrench'];

const nameConfig: Config = {
    dictionaries: [NAMES, NAMES],
    separator: ' ',
    length: 2,
    style: 'capital'
};

const bandConfig: Config = {
    dictionaries: [adjectives, colors, animals],
    separator: ' ',
    length: 3,
    style: 'capital'
};

// Singleton color choices.
export const COLORS = Phaser.Display.Color.ColorSpectrum(64);

class LoadoutGeneratorImpl {
    public getRandomName() {
        return uniqueNamesGenerator(nameConfig);
    }

    public getRandomBandName() {
        return uniqueNamesGenerator(bandConfig) + 's';
    }

    public generateRandomFace(): FaceConfig {
        return {
            [BodyPart.head]: {
                texture: this.getRandom(BodyChoices[BodyPart.head]),
                tint: this.getRandom(COLORS)
            },
            [BodyPart.hair]: {
                texture: this.getRandom(BodyChoices[BodyPart.hair]),
                tint: this.getRandom(COLORS)
            },
            [BodyPart.eyebrows]: {
                texture: this.getRandom(BodyChoices[BodyPart.eyebrows])
            },
            [BodyPart.eyes]: {
                texture: this.getRandom(BodyChoices[BodyPart.eyes])
            },
            [BodyPart.nose]: {
                texture: this.getRandom(BodyChoices[BodyPart.nose])
            },
            [BodyPart.mouth]: {
                texture: this.getRandom(BodyChoices[BodyPart.mouth])
            }
        };
    }

    public generateRandomLoadout(isMainCharacter: boolean = false): Loadout {
        return {
            name: this.getRandomName(),
            bandName: this.getRandomBandName(),
            face: this.generateRandomFace(),
            dayTrait: isMainCharacter ? Phaser.Utils.Array.GetRandom(STARTING_TRAITS) : this.randomTrait(),
            nightTrait: isMainCharacter ? Phaser.Utils.Array.GetRandom(STARTING_TRAITS) : this.randomTrait()
        };
    }

    public loadoutToDriverCharacterState(loadout: Loadout): CharacterState {
        return {
            name: loadout.name,
            face: loadout.face,
            isDriver: true,
            seatPosition: 1,
            dayTrait: loadout.dayTrait,
            nightTrait: loadout.nightTrait,
            instrument: 'vocal-guitar', // driver MUST be vocal-guitar
            happiness: 100,
            isAngry: false,
            isLonely: false,
            isRageQuit: false,
            skill: ''
        };
    }

    public loadoutToRandomCharacterState(loadout: Loadout, seatPosition: number, instrument: TrackName, skill: string): CharacterState {
        return {
            name: loadout.name,
            face: loadout.face,
            seatPosition: seatPosition,
            dayTrait: loadout.dayTrait,
            nightTrait: loadout.nightTrait,
            instrument: instrument,
            happiness: 100,
            isAngry: false,
            isLonely: false,
            isRageQuit: false,
            skill: skill
        };
    }

    public randomTrait(): string {
        return Phaser.Utils.Array.GetRandom(TRAITS);
    }

    public randomSkill(): string {
        return Phaser.Utils.Array.GetRandom(SKILLS);
    }

    private getRandom(arr: any[]) {
        return Phaser.Utils.Array.GetRandom(arr);
    }

    public getTint(color: Phaser.Types.Display.ColorObject) {
        return Phaser.Display.Color.ObjectToColor(color).desaturate(50).color;
    }

    /**
     * Given a loadout, generates a single sprite with the combined textures to create a face.
     */
    public createFaceSprite(scene: Phaser.Scene, face: FaceConfig) {
        let head = new Phaser.GameObjects.Sprite(scene, 0, 0, face[BodyPart.head].texture)
            .setTint(this.getTint(face[BodyPart.head].tint))
            .setOrigin(0, 0);
        let hair = new Phaser.GameObjects.Sprite(scene, 0, 0, face[BodyPart.hair].texture)
            .setTint(this.getTint(face[BodyPart.hair].tint))
            .setOrigin(0, 0);
        let eyebrows = new Phaser.GameObjects.Sprite(scene, 0, 0, face[BodyPart.eyebrows].texture).setOrigin(0, 0);
        let eyes = new Phaser.GameObjects.Sprite(scene, 0, 0, face[BodyPart.eyes].texture).setOrigin(0, 0);
        let nose = new Phaser.GameObjects.Sprite(scene, 0, 0, face[BodyPart.nose].texture).setOrigin(0, 0);
        let mouth = new Phaser.GameObjects.Sprite(scene, 0, 0, face[BodyPart.mouth].texture).setOrigin(0, 0);

        let combined = new Phaser.GameObjects.RenderTexture(scene, 0, 0, 712, 843);
        combined.draw([head, eyebrows, eyes, hair, mouth, nose]);

        head.destroy();
        hair.destroy();
        eyebrows.destroy();
        eyes.destroy();
        nose.destroy();
        mouth.destroy();
        return combined;
    }
}
const LoadoutGenerator = new LoadoutGeneratorImpl();
export default LoadoutGenerator;
