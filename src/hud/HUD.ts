import { DISPLAY_SIZE } from "../constants";
import LoadoutGenerator from "../LoadoutGenerator";
import { TrackKey } from "../MusicTracks";
import { CharacterState, GameState } from "../scenes/GameScene";

class CharacterCard extends Phaser.GameObjects.Container {
    private character: CharacterState;
    private mood: Phaser.GameObjects.Rectangle;
    
    constructor(scene: Phaser.Scene, character: CharacterState) {
        super(scene);
        this.character = character;
        let bg = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, 415, 300, 0x2d2e27, 1).setOrigin(0, 0);
        this.add(bg);

        // Portrait
        this.add(new Phaser.GameObjects.Rectangle(this.scene, 20, 20, 180, 225, 0xffffff, 1).setOrigin(0, 0));
        this.add(LoadoutGenerator.createFaceSprite(this.scene, character.face).setPosition(20, 20).setOrigin(0, 0).setScale(0.35));

        // Name
        this.add(new Phaser.GameObjects.Text(this.scene, 225, 25, character.name, {
            fontFamily: 'Octanis',
            fontSize: this.getFontSize(character.name),
            color: '#fff',
            wordWrap: { width: 170, useAdvancedWrap: true }
        }).setOrigin(0, 0));

        // Instrument
        this.add(new Phaser.GameObjects.Sprite(this.scene, 255, 80, character.instrument).setOrigin(0, 0).setScale(character.instrument === 'uke' ? 0.55 : 0.7));

        //Traits
        this.add(new Phaser.GameObjects.Text(this.scene, 225, 180, 'Traits:', {
            fontFamily: 'Octanis',
            fontSize: '1rem',
            color: '#fff'
        }).setOrigin(0, 0));
        this.add(new Phaser.GameObjects.Sprite(this.scene, 275, 195, character.dayTrait).setOrigin(0, 0).setScale(0.35));
        this.add(new Phaser.GameObjects.Sprite(this.scene, 335, 195, character.nightTrait).setOrigin(0, 0).setScale(0.35));

        // Mood
        this.add(new Phaser.GameObjects.Rectangle(this.scene, 50, 260, 315, 20, 0xffffff, 1).setOrigin(0, 0));
        this.mood = new Phaser.GameObjects.Rectangle(this.scene, 55, 265, ((this.character.happiness) / 100) * 305, 10, 0xFF0000, 1).setOrigin(0, 0);
        this.add(this.mood);
    }
    
    getFontSize(text: string) {
        if (!text) return '1rem';
        if (text.length < 30) {
            return '1.8rem';
        }
        if (text.length < 40) {
            return '1.35rem';
        }
        if (text.length < 50) {
            return '1rem';
        }
        return '0.65rem';
    }

    public update() {
        this.mood.width = (((this.character.happiness) / 100) * 305);
    }
}

export default class HUD extends Phaser.GameObjects.Container {
    private gameState: GameState;
    private characterCards: Phaser.GameObjects.Container[];
    private walletBg: Phaser.GameObjects.Rectangle;
    private walletText: Phaser.GameObjects.Text;
    private checkQueue: boolean;

    constructor(scene: Phaser.Scene, gameState: GameState) {
        super(scene);
        this.gameState = gameState;
        this.characterCards = [];
        this.checkQueue = true;
        this.createCharacterCards();
        
        // Wallet
        this.walletBg = new Phaser.GameObjects.Rectangle(scene, 40, 40, 5 * 16, 42, 0x000000, 0.35).setOrigin(0, 0);
        this.add(this.walletBg);
        this.walletText = new Phaser.GameObjects.Text(scene, 50, 45, '' + this.gameState.wallet.get(), {
            fontFamily: 'Digital',
            fontSize: '2rem',
            color: '#00FF00'
        }).setOrigin(0, 0);
        this.add(this.walletText);
    }

    private createCharacterCards() {
        for (let i = 0; i < this.gameState.characters.length; i++) {
            let character = this.gameState.characters[i];
            let card = new CharacterCard(this.scene, character);
            card.setPosition(i * 465 + 50, DISPLAY_SIZE.height - 325);
            this.add(card).characterCards.push(card);
        }
    }

    public update() {
        this.characterCards.forEach(card => card.update());
        let money = this.gameState.wallet.get();
        let str = '$' + money;
        this.walletBg.width = str.length * 16 + 20;
        this.walletText.setText(str);
        this.checkQueue && this.checkWalletQueue();
    }

    public characterChange () {
        this.characterCards.forEach(card => card.destroy());
        this.characterCards = [];
        this.createCharacterCards();
    }

    private checkWalletQueue() {
        let queuedKache = this.gameState.wallet.getNextQueue();
        if (queuedKache) {
            this.checkQueue = false;
            this.scene.add.kaching(queuedKache.amount, queuedKache.reason, queuedKache.gain);
            setTimeout(() => {
                this.checkQueue = true;
            }, 2200);
        }
    }
}