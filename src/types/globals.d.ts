declare interface Loadout {
    name: string;
    bandName: string;
    face: {
        head: {
            texture: string;
            tint: number;
        };
        hair: {
            texture: string;
            tint: number;
        };
        eyebrows: {
            texture: string;
            tint: number;
        };
        eyes: {
            texture: string;
            tint: number;
        };
        nose: {
            texture: string;
            tint: number;
        };
        mouth: {
            texture: string;
            tint: number;
        };
    };
    personality?: any;
}

declare interface IConversation extends Phaser.GameObjects.Container {
    begin: () => void;
}
declare interface IEditor extends Phaser.GameObjects.Container {}

declare namespace Phaser.GameObjects {
    interface GameObjectFactory {
        conversation(key: string): IConversation;
        editor(sprite: Phaser.GameObjects.Sprite, part: string, loadout: Loadout, useColorPicker?: boolean): IEditor;
    }
}
