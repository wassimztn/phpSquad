import Phaser from 'phaser';

export class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.player = null;
        this.enemies = null;
        this.cursors = null;
        this.playerHealth = 100;
        this.playerData = 100; // Les "données" du joueur
    }

    create() {
        console.log('Main Scene: Game started');
        
        // Créer le monde
        this.createWorld();
        
        // Créer le joueur
        this.createPlayer();
        
        // Créer les ennemis GAFAM
        this.createEnemies();
        
        // Configuration des contrôles
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        // UI
        this.createUI();
        
        // Collisions
        this.physics.add.overlap(this.player, this.enemies, this.encounterEnemy, null, this);
    }

    createWorld() {
        // Créer un sol simple
        for (let x = 0; x < 25; x++) {
            for (let y = 0; y < 19; y++) {
                this.add.image(x * 32 + 16, y * 32 + 16, 'ground');
            }
        }
        
        // Murs autour
        for (let x = 0; x < 25; x++) {
            this.add.image(x * 32 + 16, 16, 'wall');
            this.add.image(x * 32 + 16, 584, 'wall');
        }
        for (let y = 1; y < 18; y++) {
            this.add.image(16, y * 32 + 16, 'wall');
            this.add.image(784, y * 32 + 16, 'wall');
        }
    }

    createPlayer() {
        this.player = this.physics.add.sprite(400, 300, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setScale(1);
    }

    createEnemies() {
        this.enemies = this.physics.add.group();
        
        const enemyTypes = [
            'enemy_google',
            'enemy_apple', 
            'enemy_facebook',
            'enemy_amazon',
            'enemy_microsoft'
        ];
        
        const enemyNames = ['Google', 'Apple', 'Meta', 'Amazon', 'Microsoft'];
        
        // Créer 5 ennemis aléatoires
        for (let i = 0; i < 5; i++) {
            const x = Phaser.Math.Between(100, 700);
            const y = Phaser.Math.Between(100, 500);
            const enemyIndex = Phaser.Math.Between(0, 4);
            
            const enemy = this.enemies.create(x, y, enemyTypes[enemyIndex]);
            enemy.enemyName = enemyNames[enemyIndex];
            enemy.health = Phaser.Math.Between(30, 60);
            enemy.setVelocity(
                Phaser.Math.Between(-50, 50),
                Phaser.Math.Between(-50, 50)
            );
            enemy.setBounce(1);
            enemy.setCollideWorldBounds(true);
        }
    }

    createUI() {
        // Barre de vie
        this.healthText = this.add.text(16, 16, `❤️ Vie: ${this.playerHealth}`, {
            fontSize: '20px',
            fill: '#0f0',
            backgroundColor: '#000',
            padding: { x: 10, y: 5 }
        });
        
        // Barre de données
        this.dataText = this.add.text(16, 50, `📊 Données: ${this.playerData}%`, {
            fontSize: '20px',
            fill: '#00f',
            backgroundColor: '#000',
            padding: { x: 10, y: 5 }
        });
        
        // Score
        this.scoreText = this.add.text(16, 84, '🏆 Score: 0', {
            fontSize: '20px',
            fill: '#ff0',
            backgroundColor: '#000',
            padding: { x: 10, y: 5 }
        });
    }

    update() {
        // Mouvement du joueur
        this.player.setVelocity(0);
        
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
        }
        
        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-200);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(200);
        }
    }

    encounterEnemy(player, enemy) {
        // Désactiver temporairement le mouvement
        this.physics.pause();
        
        // Lancer la scène de combat
        this.scene.launch('BattleScene', {
            enemyName: enemy.enemyName,
            enemyHealth: enemy.health,
            playerHealth: this.playerHealth,
            playerData: this.playerData,
            enemy: enemy
        });
        
        this.scene.pause();
    }
}
