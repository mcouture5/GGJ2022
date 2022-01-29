import { uniqueNamesGenerator, Config, adjectives, colors, animals, names } from 'unique-names-generator';

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
    [BodyPart.hair]: ['hair1', 'hair2', 'hair3', 'hair4', 'hair5'],
    [BodyPart.eyebrows]: ['eyebrows1', 'eyebrows2', 'eyebrows3', 'eyebrows4', 'eyebrows5', 'eyebrows6', 'eyebrows7'],
    [BodyPart.eyes]: ['eyes1', 'eyes2', 'eyes3', 'eyes4', 'eyes5', 'eyes6', 'eyes7'],
    [BodyPart.nose]: ['nose1', 'nose2', 'nose3', 'nose4'],
    [BodyPart.mouth]: ['mouth1', 'mouth2']
};

const nameConfig: Config = {
    dictionaries: [names, names],
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
    public getDefaultLoadout(): Loadout {
        return {
            name: this.getRandomName(),
            bandName: this.getRandomBandName(),
            face: {
                [BodyPart.head]: {
                    texture: 'head1'
                },
                [BodyPart.hair]: {
                    texture: 'hair'
                },
                [BodyPart.eyebrows]: {
                    texture: 'eyebrows'
                },
                [BodyPart.eyes]: {
                    texture: 'eyes1'
                },
                [BodyPart.nose]: {
                    texture: 'nose1'
                },
                [BodyPart.mouth]: {
                    texture: 'mouth1'
                }
            }
        };
    }

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

    public genrateRandomLoadout() {}

    private getRandom(arr: any[]) {
        return arr[Math.min(Math.floor(Math.random() * arr.length), arr.length - 1)];
    }

    private colorToNumber(color: Phaser.Types.Display.ColorObject) {
        return Phaser.Display.Color.GetColor(color.r, color.g, color.b);
    }

    /**
     * Given a loadout, generates a single sprite with the combined textures to create a face.
     */
    public createFaceSprite(scene: Phaser.Scene, loadout: Loadout) {
        let head = new Phaser.GameObjects.Sprite(scene, 0, 0, loadout.face[BodyPart.head].texture)
            .setTint(this.colorToNumber(loadout.face[BodyPart.head].tint))
            .setOrigin(0, 0);
        let hair = new Phaser.GameObjects.Sprite(scene, 0, 0, loadout.face[BodyPart.hair].texture)
            .setTint(this.colorToNumber(loadout.face[BodyPart.hair].tint))
            .setOrigin(0, 0);
        let eyebrows = new Phaser.GameObjects.Sprite(scene, 0, 0, loadout.face[BodyPart.eyebrows].texture).setOrigin(0, 0);
        let eyes = new Phaser.GameObjects.Sprite(scene, 0, 0, loadout.face[BodyPart.eyes].texture).setOrigin(0, 0);
        let nose = new Phaser.GameObjects.Sprite(scene, 0, 0, loadout.face[BodyPart.nose].texture).setOrigin(0, 0);
        let mouth = new Phaser.GameObjects.Sprite(scene, 0, 0, loadout.face[BodyPart.mouth].texture).setOrigin(0, 0);

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
