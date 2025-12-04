import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Créer les assets pixelisés en code (placeholder)
        this.createPlayerSprite();
        this.createEnemySprites();
        this.createTileset();
    }

    create() {
        console.log('Boot Scene: Assets loaded');
        this.scene.start('MainScene');
    }

    createPlayerSprite() {
        // Créer un sprite de joueur simple (carré vert)
        const graphics = this.add.graphics();
        graphics.fillStyle(0x00ff00, 1);
        graphics.fillRect(0, 0, 32, 32);
        graphics.generateTexture('player', 32, 32);
        graphics.destroy();
    }

    createEnemySprites() {
        // GAFAM ennemis avec couleurs distinctes
        const enemies = [
            { key: 'enemy_google', color: 0x4285F4, name: 'G' },
            { key: 'enemy_apple', color: 0xA3AAAE, name: 'A' },
            { key: 'enemy_facebook', color: 0x1877F2, name: 'F' },
            { key: 'enemy_amazon', color: 0xFF9900, name: 'A' },
            { key: 'enemy_microsoft', color: 0x00A4EF, name: 'M' }
        ];

        enemies.forEach(enemy => {
            const graphics = this.add.graphics();
            graphics.fillStyle(enemy.color, 1);
            graphics.fillRect(0, 0, 32, 32);
            graphics.fillStyle(0x000000, 1);
            graphics.fillRect(8, 8, 16, 16);
            graphics.generateTexture(enemy.key, 32, 32);
            graphics.destroy();
        });
    }

    createTileset() {
        // Sol simple
        const graphics = this.add.graphics();
        graphics.fillStyle(0x2d3436, 1);
        graphics.fillRect(0, 0, 32, 32);
        graphics.lineStyle(1, 0x636e72, 0.5);
        graphics.strokeRect(0, 0, 32, 32);
        graphics.generateTexture('ground', 32, 32);
        graphics.destroy();

        // Mur
        const wallGraphics = this.add.graphics();
        wallGraphics.fillStyle(0x636e72, 1);
        wallGraphics.fillRect(0, 0, 32, 32);
        wallGraphics.lineStyle(2, 0x2d3436, 1);
        wallGraphics.strokeRect(0, 0, 32, 32);
        wallGraphics.generateTexture('wall', 32, 32);
        wallGraphics.destroy();
    }
}
