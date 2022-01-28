import { BodyPart } from './LoadoutGenerator';
import Conversation from './objects/Conversation';
import { Editor } from './objects/editor/Editor';

Phaser.GameObjects.GameObjectFactory.register('conversation', function (this: Phaser.GameObjects.GameObjectFactory, key: string) {
    const conversation = new Conversation(this.scene, key);
    this.displayList.add(conversation);
    return conversation;
});

Phaser.GameObjects.GameObjectFactory.register(
    'editor',
    function (
        this: Phaser.GameObjects.GameObjectFactory,
        sprite: Phaser.GameObjects.Sprite,
        part: BodyPart,
        loadout: Loadout,
        useColorPicker: boolean = false
    ) {
        const editor = new Editor(this.scene, sprite, part, loadout, useColorPicker);
        this.displayList.add(editor);
        return editor;
    }
);
