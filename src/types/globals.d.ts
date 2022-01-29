declare interface FacePart {
    texture: string;
    tint?: Phaser.Types.Display.ColorObject;
}

declare interface FaceConfig {
    head: FacePart;
    hair: FacePart;
    eyebrows: FacePart;
    eyes: FacePart;
    nose: FacePart;
    mouth: FacePart;
}

declare interface Loadout {
    name: string;
    bandName: string; // Only used during character creation
    face: FaceConfig;
    personality?: any;
}

declare interface IConversation extends Phaser.GameObjects.Container {
    begin: () => void;
}
declare interface IEditor extends Phaser.GameObjects.Container {
    setValue: (part: FacePart) => void;
}

declare namespace Phaser.GameObjects {
    interface GameObjectFactory {
        conversation(key: string, speaker?: string): IConversation;
        editor(sprite: Phaser.GameObjects.Sprite, part: string, loadout: Loadout, useColorPicker?: boolean): IEditor;
    }
}
