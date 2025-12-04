import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene.js';
import { MainScene } from './scenes/MainScene.js';
import { BattleScene } from './scenes/BattleScene.js';

export class Game {
    constructor() {
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'game-canvas',
            backgroundColor: '#1a1a2e',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: true
                }
            },
            scene: [BootScene, MainScene, BattleScene]
        };

        this.game = new Phaser.Game(config);
    }
}
