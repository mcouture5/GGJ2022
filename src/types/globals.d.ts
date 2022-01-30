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
    dayTrait: string;
    nightTrait: string;
}

declare type PerformanceRating = 'poor' | 'okay' | 'good' | 'excellent';

declare interface IConversation extends Phaser.GameObjects.Container {
    begin: () => void;
    setTemplateData(templateData: {[key: string]: string}): void;
}
declare interface IEditor extends Phaser.GameObjects.Container {
    setValue: (part: FacePart) => void;
}
declare interface IKaching extends Phaser.GameObjects.Container {}

declare namespace Phaser.GameObjects {
    interface GameObjectFactory {
        conversation(w: number, h: number, key: string, speaker?: string): IConversation;
        editor(w: number, h: number, sprite: Phaser.GameObjects.Sprite, part: string, loadout: Loadout, useColorPicker?: boolean): IEditor;
        kaching(amount: number, reason: string, gain?: boolean): IKaching;
    }
}
