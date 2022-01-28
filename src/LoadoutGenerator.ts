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

class LoadoutGeneratorImpl {
    public getDefaultLoadout(): Loadout {
        return {
            name: '',
            bandName: '',
            face: {
                [BodyPart.head]: {
                    texture: 'head1',
                    tint: 0xffffff00
                },
                [BodyPart.hair]: {
                    texture: 'hair',
                    tint: 0xffffff00
                },
                [BodyPart.eyebrows]: {
                    texture: 'eyebrows',
                    tint: 0xffffff00
                },
                [BodyPart.eyes]: {
                    texture: 'eyes1',
                    tint: 0xffffff00
                },
                [BodyPart.nose]: {
                    texture: 'nose1',
                    tint: 0xffffff00
                },
                [BodyPart.mouth]: {
                    texture: 'mouth1',
                    tint: 0xffffff00
                }
            }
        };
    }

    public genrateRandomLoadout() {}

    /**
     * Given a loadout, generates a single sprite with the combined textures to create a face.
     */
    public createFaceSprite(scene: Phaser.Scene, loadout: Loadout) {
        let head = new Phaser.GameObjects.Sprite(scene, 0, 0, loadout.face[BodyPart.head].texture).setTint(loadout.face[BodyPart.head].tint).setOrigin(0, 0);
        let hair = new Phaser.GameObjects.Sprite(scene, 0, 0, loadout.face[BodyPart.hair].texture).setTint(loadout.face[BodyPart.hair].tint).setOrigin(0, 0);
        let eyebrows = new Phaser.GameObjects.Sprite(scene, 0, 0, loadout.face[BodyPart.eyebrows].texture)
            .setTint(loadout.face[BodyPart.eyebrows].tint)
            .setOrigin(0, 0);
        let eyes = new Phaser.GameObjects.Sprite(scene, 0, 0, loadout.face[BodyPart.eyes].texture).setTint(loadout.face[BodyPart.eyes].tint).setOrigin(0, 0);
        let nose = new Phaser.GameObjects.Sprite(scene, 0, 0, loadout.face[BodyPart.nose].texture).setTint(loadout.face[BodyPart.nose].tint).setOrigin(0, 0);
        let mouth = new Phaser.GameObjects.Sprite(scene, 0, 0, loadout.face[BodyPart.mouth].texture).setTint(loadout.face[BodyPart.mouth].tint).setOrigin(0, 0);

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
