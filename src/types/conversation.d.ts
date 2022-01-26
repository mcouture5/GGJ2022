declare interface IConversation extends Phaser.GameObjects.Container {
    begin: () => void;
}

declare namespace Phaser.GameObjects {
    interface GameObjectFactory {
        conversation(key: string): IConversation;
    }
}
