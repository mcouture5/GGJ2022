import 'phaser';
import { Boot } from './scenes/Boot';
import { MainMenu } from './scenes/MainMenu';
import { GameScene } from './scenes/GameScene';
import { Company } from './scenes/splash/Company';
import { PhaserSplash } from './scenes/splash/Phaser';
import { DISPLAY_SIZE } from './constants';
import { CharacterCreation } from './scenes/CharacterCreation';
import { Gig } from './scenes/Gig';
import { NewBandmember } from './scenes/NewBandmember';
import GameOver from './scenes/GameOver';

// main game configuration
const config: Phaser.Types.Core.GameConfig = {
    title: 'Just The 4 Of Us',
    scale: {
        parent: 'game',
        mode: Phaser.Scale.FIT,
        width: DISPLAY_SIZE.width,
        height: DISPLAY_SIZE.height
    },
    parent: 'game',
    scene: [Boot, Company, PhaserSplash, MainMenu, GameScene, CharacterCreation, Gig, NewBandmember, GameOver],
    input: {
        keyboard: false,
        mouse: true,
        touch: true,
        gamepad: false
    },
    physics: null,
    backgroundColor: '#000000',// '#e4e4eb',
    render: { pixelArt: false, antialias: true },
    dom: {
        createContainer: true
    }
};

// game class
export class Game extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}

// when the page is loaded, create our game instance
window.addEventListener('load', () => {
    var game = new Game(config);
});
