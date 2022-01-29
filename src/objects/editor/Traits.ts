import { STARTING_TRAITS } from "../../LoadoutGenerator";

export const TRAIT_SELECTED = 'trait-selected';

export default class Traits extends Phaser.GameObjects.Container {
    private loadout: Loadout;
    private selected: Phaser.GameObjects.Ellipse;
    private isDay: boolean;

    constructor(scene: Phaser.Scene, timeOfDay: string, loadout: Loadout) {
        super(scene);
        this.loadout = loadout;
        this.isDay = timeOfDay === 'day';
        let timeIcon = new Phaser.GameObjects.Sprite(this.scene, 0, 0, timeOfDay)
            .setScale(0.28, 0.28)
            .setOrigin(0, 0)
            .setTint(this.isDay ? 0xFFFF00 : 0xFFFFFF);
        this.add(timeIcon);
        this.selected = new Phaser.GameObjects.Ellipse(this.scene, 0, 0, 46, 46, 0x666666, 1).setOrigin(0, 0);
        let choiceIndex = STARTING_TRAITS.indexOf(this.isDay ? loadout.dayTrait : loadout.nightTrait);
        this.selected.setPosition(choiceIndex * 50 + 61, 2);
        this.add(this.selected);
        for (let i = 0; i < STARTING_TRAITS.length; i++) {
            let trait = STARTING_TRAITS[i];
            let traitIcon = new Phaser.GameObjects.Sprite(this.scene, i * 50 + 65, 6, trait).setScale(0.3, 0.3).setOrigin(0, 0);
            traitIcon.setInteractive({ useHandCursor: true });
            traitIcon.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                this.selected.setX(i * 50 + 61);
                this.emit(TRAIT_SELECTED, trait);
            });
            this.add(traitIcon);
        }
    }

    setValue(trait: string) {
        let choiceIndex = STARTING_TRAITS.indexOf(trait);
        this.selected.setX(choiceIndex * 50 + 61);
        this.emit(TRAIT_SELECTED, trait);
    }
}
