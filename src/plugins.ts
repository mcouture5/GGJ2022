import { BodyPart } from './LoadoutGenerator';
import Conversation from './objects/Conversation';
import { Editor } from './objects/editor/Editor';
import Kaching from './objects/Kaching';

Phaser.GameObjects.GameObjectFactory.register('conversation', function (this: Phaser.GameObjects.GameObjectFactory, w: number, h: number, key: string, speaker?: string) {
    const conversation = new Conversation(this.scene, w, h, key, speaker);
    this.displayList.add(conversation);
    return conversation;
});

Phaser.GameObjects.GameObjectFactory.register(
    'editor',
    function (
        this: Phaser.GameObjects.GameObjectFactory,
        w: number,
        h: number,
        sprite: Phaser.GameObjects.Sprite,
        part: BodyPart,
        loadout: Loadout,
        useColorPicker: boolean = false
    ) {
        const editor = new Editor(this.scene, w, h, sprite, part, loadout, useColorPicker);
        this.displayList.add(editor);
        return editor;
    }
);

Phaser.GameObjects.GameObjectFactory.register(
    'kaching',
    function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, amount: number, gain?: boolean) {
        const kaching = new Kaching(this.scene, x, y, amount, gain);
        this.displayList.add(kaching);
        return kaching;
    }
);

