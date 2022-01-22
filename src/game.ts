import 'phaser';
import { MainMenu } from './scenes/MainMenu';
import { GameScene } from './scenes/GameScene';

// main game configuration
const config: Phaser.Types.Core.GameConfig = {
    title: 'Just The 4 Of Us',
    scale: {
        parent: 'game',
        mode: Phaser.Scale.FIT,
        width: 1920,
        height: 1080
    },
    parent: 'game',
    scene: [MainMenu, GameScene],
    input: {
        keyboard: false,
        mouse: true,
        touch: true,
        gamepad: false
    },
    physics: null,
    backgroundColor: '#a8a8a8',
    render: { pixelArt: false, antialias: true }
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
