import Phaser from 'phaser';

// Boot Scene - Chargement des assets
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        console.log('Chargement des assets...');
        this.createPlayerSprite();
        this.createEnemySprites();
        this.createTileset();
    }

    create() {
        console.log('Assets chargés, démarrage du jeu');
        this.scene.start('MainScene');
    }

    createPlayerSprite() {
        const graphics = this.add.graphics();
        graphics.fillStyle(0x00ff00, 1);
        graphics.fillRect(0, 0, 32, 32);
        graphics.generateTexture('player', 32, 32);
        graphics.destroy();
    }

    createEnemySprites() {
        const enemies = [
            { key: 'enemy_google', color: 0x4285F4 },
            { key: 'enemy_apple', color: 0xA3AAAE },
            { key: 'enemy_facebook', color: 0x1877F2 },
            { key: 'enemy_amazon', color: 0xFF9900 },
            { key: 'enemy_microsoft', color: 0x00A4EF }
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
        const graphics = this.add.graphics();
        graphics.fillStyle(0x2d3436, 1);
        graphics.fillRect(0, 0, 32, 32);
        graphics.lineStyle(1, 0x636e72, 0.5);
        graphics.strokeRect(0, 0, 32, 32);
        graphics.generateTexture('ground', 32, 32);
        graphics.destroy();

        const wallGraphics = this.add.graphics();
        wallGraphics.fillStyle(0x636e72, 1);
        wallGraphics.fillRect(0, 0, 32, 32);
        wallGraphics.lineStyle(2, 0x2d3436, 1);
        wallGraphics.strokeRect(0, 0, 32, 32);
        wallGraphics.generateTexture('wall', 32, 32);
        wallGraphics.destroy();
    }
}

// Main Scene - Jeu principal
class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.playerHealth = 100;
        this.playerData = 100;
    }

    create() {
        console.log('Main Scene démarrée');
        
        this.createWorld();
        this.createPlayer();
        this.createEnemies();
        
        this.cursors = this.input.keyboard.createCursorKeys();
        
        this.createUI();
        
        this.physics.add.overlap(this.player, this.enemies, this.encounterEnemy, null, this);
    }

    createWorld() {
        for (let x = 0; x < 25; x++) {
            for (let y = 0; y < 19; y++) {
                this.add.image(x * 32 + 16, y * 32 + 16, 'ground');
            }
        }
        
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
    }

    createEnemies() {
        this.enemies = this.physics.add.group();
        
        const enemyTypes = ['enemy_google', 'enemy_apple', 'enemy_facebook', 'enemy_amazon', 'enemy_microsoft'];
        const enemyNames = ['Google', 'Apple', 'Meta', 'Amazon', 'Microsoft'];
        
        for (let i = 0; i < 5; i++) {
            const x = Phaser.Math.Between(100, 700);
            const y = Phaser.Math.Between(100, 500);
            const enemyIndex = Phaser.Math.Between(0, 4);
            
            const enemy = this.enemies.create(x, y, enemyTypes[enemyIndex]);
            enemy.enemyName = enemyNames[enemyIndex];
            enemy.health = Phaser.Math.Between(40, 60);
            enemy.setVelocity(
                Phaser.Math.Between(-50, 50),
                Phaser.Math.Between(-50, 50)
            );
            enemy.setBounce(1);
            enemy.setCollideWorldBounds(true);
        }
    }

    createUI() {
        this.healthText = this.add.text(16, 16, `❤️ Vie: ${this.playerHealth}`, {
            fontSize: '20px',
            fill: '#0f0',
            backgroundColor: '#000',
            padding: { x: 10, y: 5 }
        });
        
        this.dataText = this.add.text(16, 50, `📊 Données: ${this.playerData}%`, {
            fontSize: '20px',
            fill: '#00f',
            backgroundColor: '#000',
            padding: { x: 10, y: 5 }
        });
    }

    update() {
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
        this.physics.pause();
        
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

// Battle Scene - Combats
class BattleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BattleScene' });
    }

    init(data) {
        this.enemyName = data.enemyName;
        this.enemyHealth = data.enemyHealth;
        this.playerHealth = data.playerHealth;
        this.playerData = data.playerData;
        this.enemySprite = data.enemy;
    }

    create() {
        this.playerChoice = null;
        this.enemyChoice = null;
        this.roundInProgress = false;
        
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.9);
        
        this.add.text(400, 40, `💻 CYBER BATAILLE CONTRE ${this.enemyName.toUpperCase()} 💻`, {
            fontSize: '28px',
            fill: '#f00',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.add.text(150, 120, '👤 Vous', {
            fontSize: '24px',
            fill: '#0f0'
        });
        
        this.playerHealthBar = this.add.rectangle(150, 160, this.playerHealth * 2, 30, 0x00ff00);
        this.playerHealthBar.setOrigin(0, 0.5);
        this.playerHealthText = this.add.text(150, 185, `${this.playerHealth} PV`, {
            fontSize: '16px',
            fill: '#0f0'
        });
        
        this.add.text(550, 120, `🏢 ${this.enemyName}`, {
            fontSize: '24px',
            fill: '#f00'
        });
        
        this.enemyHealthBar = this.add.rectangle(550, 160, this.enemyHealth * 2, 30, 0xff0000);
        this.enemyHealthBar.setOrigin(0, 0.5);
        this.enemyHealthText = this.add.text(550, 185, `${this.enemyHealth} PV`, {
            fontSize: '16px',
            fill: '#f00'
        });
        
        this.dataText = this.add.text(400, 220, `📊 Vos données: ${this.playerData}%`, {
            fontSize: '20px',
            fill: '#00f'
        }).setOrigin(0.5);
        
        this.playerChoiceDisplay = this.add.text(200, 280, '', {
            fontSize: '48px'
        }).setOrigin(0.5);
        
        this.enemyChoiceDisplay = this.add.text(600, 280, '❓', {
            fontSize: '48px'
        }).setOrigin(0.5);
        
        this.battleLog = this.add.text(400, 350, `${this.enemyName} tente de pirater vos données !\nChoisissez votre défense cyber !`, {
            fontSize: '16px',
            fill: '#fff',
            backgroundColor: '#333',
            padding: { x: 20, y: 10 },
            align: 'center'
        }).setOrigin(0.5);
        
        this.createActionButtons();
    }

    createActionButtons() {
        const buttonY = 480;
        const buttonWidth = 200;
        const buttonHeight = 80;
        
        const firewallBtn = this.add.rectangle(150, buttonY, buttonWidth, buttonHeight, 0x0088ff);
        this.add.text(150, buttonY - 15, '🔐 FIREWALL', {
            fontSize: '20px',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.add.text(150, buttonY + 15, 'Bloque les virus', {
            fontSize: '14px',
            fill: '#ccc'
        }).setOrigin(0.5);
        
        firewallBtn.setInteractive({ useHandCursor: true });
        firewallBtn.on('pointerdown', () => this.makeChoice('firewall'));
        firewallBtn.on('pointerover', () => firewallBtn.setFillStyle(0x00aaff));
        firewallBtn.on('pointerout', () => firewallBtn.setFillStyle(0x0088ff));
        
        const virusBtn = this.add.rectangle(400, buttonY, buttonWidth, buttonHeight, 0xff0000);
        this.add.text(400, buttonY - 15, '🐛 VIRUS', {
            fontSize: '20px',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.add.text(400, buttonY + 15, 'Infecte le système', {
            fontSize: '14px',
            fill: '#ccc'
        }).setOrigin(0.5);
        
        virusBtn.setInteractive({ useHandCursor: true });
        virusBtn.on('pointerdown', () => this.makeChoice('virus'));
        virusBtn.on('pointerover', () => virusBtn.setFillStyle(0xff3333));
        virusBtn.on('pointerout', () => virusBtn.setFillStyle(0xff0000));
        
        const exploitBtn = this.add.rectangle(650, buttonY, buttonWidth, buttonHeight, 0x00ff00);
        this.add.text(650, buttonY - 15, '💉 EXPLOIT', {
            fontSize: '20px',
            fill: '#000',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.add.text(650, buttonY + 15, 'Perce les défenses', {
            fontSize: '14px',
            fill: '#003300'
        }).setOrigin(0.5);
        
        exploitBtn.setInteractive({ useHandCursor: true });
        exploitBtn.on('pointerdown', () => this.makeChoice('exploit'));
        exploitBtn.on('pointerover', () => exploitBtn.setFillStyle(0x33ff33));
        exploitBtn.on('pointerout', () => exploitBtn.setFillStyle(0x00ff00));
    }

    makeChoice(choice) {
        if (this.roundInProgress) return;
        
        this.roundInProgress = true;
        this.playerChoice = choice;
        
        const icons = { 'firewall': '🔐', 'virus': '🐛', 'exploit': '💉' };
        this.playerChoiceDisplay.setText(icons[choice]);
        
        const choices = ['firewall', 'virus', 'exploit'];
        this.enemyChoice = Phaser.Math.RND.pick(choices);
        
        this.battleLog.setText('Analyse en cours...');
        
        this.time.delayedCall(1000, () => {
            this.enemyChoiceDisplay.setText(icons[this.enemyChoice]);
            this.resolveRound();
        });
    }

    resolveRound() {
        const p = this.playerChoice;
        const e = this.enemyChoice;
        
        let result = '';
        let damage = 20;
        let dataLoss = 15;
        
        if (p === e) {
            result = '⚖️ ÉGALITÉ ! Aucun dégât !';
        } else if (
            (p === 'firewall' && e === 'virus') ||
            (p === 'virus' && e === 'exploit') ||
            (p === 'exploit' && e === 'firewall')
        ) {
            this.enemyHealth -= damage;
            this.enemyHealthBar.setSize(Math.max(0, this.enemyHealth * 2), 30);
            this.enemyHealthText.setText(`${this.enemyHealth} PV`);
            
            const messages = {
                'firewall-virus': '🔐 Votre FIREWALL bloque le VIRUS !',
                'virus-exploit': '🐛 Votre VIRUS infecte l\'EXPLOIT !',
                'exploit-firewall': '💉 Votre EXPLOIT perce le FIREWALL !'
            };
            result = `✅ ${messages[`${p}-${e}`]}\n${this.enemyName} perd ${damage} PV !`;
        } else {
            this.playerHealth -= damage;
            this.playerData -= dataLoss;
            this.playerHealthBar.setSize(Math.max(0, this.playerHealth * 2), 30);
            this.playerHealthText.setText(`${this.playerHealth} PV`);
            this.dataText.setText(`📊 Vos données: ${this.playerData}%`);
            
            const messages = {
                'firewall-exploit': `💉 L'EXPLOIT de ${this.enemyName} perce votre FIREWALL !`,
                'virus-firewall': `🔐 Le FIREWALL de ${this.enemyName} bloque votre VIRUS !`,
                'exploit-virus': `🐛 Le VIRUS de ${this.enemyName} infecte votre EXPLOIT !`
            };
            result = `❌ ${messages[`${e}-${p}`]}\nVous perdez ${damage} PV et ${dataLoss}% de données !`;
        }
        
        this.battleLog.setText(result);
        
        this.time.delayedCall(2000, () => {
            if (this.enemyHealth <= 0) {
                this.victory();
            } else if (this.playerHealth <= 0 || this.playerData <= 0) {
                this.defeat();
            } else {
                this.playerChoiceDisplay.setText('');
                this.enemyChoiceDisplay.setText('❓');
                this.battleLog.setText(`Round suivant !\nChoisissez votre attaque cyber !`);
                this.roundInProgress = false;
            }
        });
    }

    victory() {
        this.battleLog.setText(`🎉 VICTOIRE ! Vous avez vaincu ${this.enemyName} !`);
        this.enemySprite.destroy();
        this.time.delayedCall(2000, () => {
            this.returnToMainScene(true);
        });
    }

    defeat() {
        this.battleLog.setText('💀 DÉFAITE ! Vos données ont été volées...');
        this.time.delayedCall(2000, () => {
            this.scene.stop('MainScene');
            this.scene.stop('BattleScene');
        });
    }

    returnToMainScene(victory) {
        const mainScene = this.scene.get('MainScene');
        mainScene.playerHealth = this.playerHealth;
        mainScene.playerData = this.playerData;
        
        this.scene.stop();
        this.scene.resume('MainScene');
        mainScene.physics.resume();
        
        if (victory) {
            mainScene.healthText.setText(`❤️ Vie: ${this.playerHealth}`);
            mainScene.dataText.setText(`📊 Données: ${this.playerData}%`);
        }
    }
}

// Configuration et démarrage du jeu
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
            debug: false
        }
    },
    scene: [BootScene, MainScene, BattleScene]
};

console.log('Initialisation du jeu Phaser...');
const game = new Phaser.Game(config);
console.log('Jeu Phaser créé !');
