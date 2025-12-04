import Phaser from 'phaser';

export class BattleScene extends Phaser.Scene {
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
        
        // Fond de combat
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.9);
        
        // Titre du combat
        this.add.text(400, 40, `💻 CYBER BATAILLE CONTRE ${this.enemyName.toUpperCase()} 💻`, {
            fontSize: '28px',
            fill: '#f00',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Barres de vie
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
        
        // Barre de données
        this.dataText = this.add.text(400, 220, `📊 Vos données: ${this.playerData}%`, {
            fontSize: '20px',
            fill: '#00f'
        }).setOrigin(0.5);
        
        // Zone d'affichage des choix
        this.playerChoiceDisplay = this.add.text(200, 280, '', {
            fontSize: '48px'
        }).setOrigin(0.5);
        
        this.enemyChoiceDisplay = this.add.text(600, 280, '❓', {
            fontSize: '48px'
        }).setOrigin(0.5);
        
        // Messages de combat
        this.battleLog = this.add.text(400, 350, `${this.enemyName} tente de pirater vos données !\nChoisissez votre défense cyber !`, {
            fontSize: '16px',
            fill: '#fff',
            backgroundColor: '#333',
            padding: { x: 20, y: 10 },
            align: 'center'
        }).setOrigin(0.5);
        
        // Boutons d'action (Pierre-Feuille-Ciseaux version Hack)
        this.createActionButtons();
    }

    createActionButtons() {
        const buttonY = 480;
        const buttonWidth = 200;
        const buttonHeight = 80;
        
        // 🔐 FIREWALL (Pierre) - Bat VIRUS, perd contre EXPLOIT
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
        
        // 🐛 VIRUS (Feuille) - Bat EXPLOIT, perd contre FIREWALL
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
        
        // 💉 EXPLOIT (Ciseaux) - Bat FIREWALL, perd contre VIRUS
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
        
        this.buttons = { firewallBtn, virusBtn, exploitBtn };
    }

    makeChoice(choice) {
        if (this.roundInProgress) return;
        
        this.roundInProgress = true;
        this.playerChoice = choice;
        
        // Afficher le choix du joueur
        const icons = {
            'firewall': '🔐',
            'virus': '🐛',
            'exploit': '💉'
        };
        this.playerChoiceDisplay.setText(icons[choice]);
        
        // L'ennemi fait son choix
        const choices = ['firewall', 'virus', 'exploit'];
        this.enemyChoice = Phaser.Math.RND.pick(choices);
        
        this.battleLog.setText('Analyse en cours...');
        
        // Révéler le choix de l'ennemi après 1 seconde
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
        
        // Logique Pierre-Feuille-Ciseaux
        // Firewall bat Virus, Virus bat Exploit, Exploit bat Firewall
        if (p === e) {
            result = '⚖️ ÉGALITÉ ! Aucun dégât !';
        } else if (
            (p === 'firewall' && e === 'virus') ||
            (p === 'virus' && e === 'exploit') ||
            (p === 'exploit' && e === 'firewall')
        ) {
            // Le joueur gagne
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
            // L'ennemi gagne
            this.playerHealth -= damage;
            this.playerData -= dataLoss;
            this.playerHealthBar.setSize(Math.max(0, this.playerHealth * 2), 30);
            this.playerHealthText.setText(`${this.playerHealth} PV`);
            this.dataText.setText(`📊 Vos données: ${this.playerData}%`);
            
            const messages = {
                'firewall-exploit': '💉 L\'EXPLOIT de ${name} perce votre FIREWALL !',
                'virus-firewall': '🔐 Le FIREWALL de ${name} bloque votre VIRUS !',
                'exploit-virus': '🐛 Le VIRUS de ${name} infecte votre EXPLOIT !'
            };
            const msg = messages[`${e}-${p}`].replace('${name}', this.enemyName);
            result = `❌ ${msg}\nVous perdez ${damage} PV et ${dataLoss}% de données !`;
        }
        
        this.battleLog.setText(result);
        
        // Vérifier la fin du combat
        this.time.delayedCall(2000, () => {
            if (this.enemyHealth <= 0) {
                this.victory();
            } else if (this.playerHealth <= 0 || this.playerData <= 0) {
                this.defeat();
            } else {
                // Nouveau round
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
            // Retour au menu ou game over
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
