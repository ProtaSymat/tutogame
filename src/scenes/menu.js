export class BaseScene extends Phaser.Scene {
    createButton(x, y, text, onClick) {
        let button = this.add.rectangle(x, y, 200, 100, 0xFFFFFF);
        button.setStrokeStyle(4, 0x000000);

        const buttonText = this.add.text(0, 0, text, {
            fontSize: '32px',
            fill: '#000'
        });
        Phaser.Display.Align.In.Center(buttonText, button);

        let clickSound = this.sound.add('clickSound');

        button.setInteractive();
        button.on('pointerover', () => {
            buttonText.setFill('#FFFFFF');
            this.sys.canvas.style.cursor = 'pointer';
            button.fillColor = 0x000000;
        });
        button.on('pointerout', () => {
            buttonText.setFill('#000000');
            this.sys.canvas.style.cursor = 'default';
            button.fillColor = 0xFFFFFF;
        });
        button.on('pointerdown', () => {
            onClick();
            clickSound.play();
        });
        return button;
    }
}

export class MenuScene extends BaseScene {
    constructor() {
        super({
            key: 'MenuScene'
        });
    }

    create() {

        if (!this.sound.get('backgroundMusic')) {
            this.backgroundMusic = this.sound.add('backgroundMusic', {
                loop: true
            });
            this.backgroundMusic.play();
            this.backgroundMusic.setVolume(0.5);
        }
        this.musicOn = true;
        let bg = this.add.image(0, 0, 'backgroundMenu').setOrigin(0, 0);
        let scaleX = this.cameras.main.width / bg.width;
        let scaleY = this.cameras.main.height / bg.height;
        let scale = Math.max(scaleX, scaleY);
        bg.setScale(scale).setScrollFactor(0);
        const playButton = this.createButton(960, 600, 'Play', () => this.startGame());
        const optionsButton = this.createButton(960, 750, 'Options', () => this.openOptions());
        const tutoButton = this.createButton(960, 900, 'Tutoriel', () => this.openTuto());
    }

    startGame() {
        this.scene.start('MainScene');
    }

    openOptions() {
        this.scene.start('OptionsScene', {
            musicOn: this.musicOn,
            returnScene: 'MenuScene'
        });
    }
    openTuto() {
        this.scene.start('TutoScene', {
            musicOn: this.musicOn,
            returnScene: 'MainScene'
        });
    }
}

export class OptionsScene extends BaseScene {
    constructor() {
        super({
            key: 'OptionsScene'
        });
    }
  
    init(data) {
        this.musicOn = data.musicOn;
        this.returnScene = data.returnScene;
    }
  
    create() {
      let bg = this.add.image(0, 0, 'backgroundOptions').setOrigin(0, 0);
      let scaleX = this.cameras.main.width / bg.width;
      let scaleY = this.cameras.main.height / bg.height;
      let scale = Math.max(scaleX, scaleY);
      bg.setScale(scale).setScrollFactor(0);
  
      let title = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 200, 'OPTIONS', { font: '200px', fill: '#000000' }).setOrigin(0.5);
  
      const backButton = this.add.image(100, 100, 'backButton').setInteractive().setScale(1.5);
      backButton.on('pointerdown', () => this.scene.start(this.returnScene));
      const muteButton = this.createButton(this.cameras.main.width / 2, this.cameras.main.height / 2, 'Mute Music', () => this.toggleMusic());
      const volumeDownButton = this.createButton(this.cameras.main.width / 2 - 200, this.cameras.main.height / 2 + 200, 'Volume -', () => this.adjustVolume(-0.1));
      const volumeUpButton = this.createButton(this.cameras.main.width / 2 + 200, this.cameras.main.height / 2 + 200, 'Volume +', () => this.adjustVolume(0.1));
  
    }
  
    toggleMusic() {
        if (this.sound.get('backgroundMusic')) {
            if (this.sound.get('backgroundMusic').isPlaying) {
                this.sound.pauseAll();
            } else {
                this.sound.resumeAll();
            }
        }
    }
  
    adjustVolume(amount) {
        let bgMusic = this.sound.get('backgroundMusic');
        if (bgMusic) {
            let newVolume = Phaser.Math.Clamp(bgMusic.volume + amount, 0, 1);
            bgMusic.setVolume(newVolume);
        }
    }
  }

export class PausedScene extends BaseScene {
    constructor() {
        super({
            key: 'PausedScene'
        });
    }

    create(data) {
        let rect = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000);
        rect.setOrigin(0, 0);
        rect.alpha = 0.7;
        const pauseText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 200, 'Pause', {
            fontSize: '64px',
            fill: '#ffffff'
        });
        pauseText.setOrigin(0.5, 0.5);
        this.createButton(this.cameras.main.centerX, this.cameras.main.centerY, 'Resume', () => this.resumeGame(data.prevScene));
        this.createButton(this.cameras.main.centerX, this.cameras.main.centerY + 150, 'Restart', () => this.restartGame(data.prevScene));
        this.createButton(this.cameras.main.centerX, this.cameras.main.centerY + 300, 'Tuto', () => this.gotoTuto());
        this.createButton(this.cameras.main.centerX, this.cameras.main.centerY + 450, 'Leave', () => this.quitGame());
    }

    resumeGame(prevScene) {
        this.scene.resume(prevScene);
        this.scene.stop('PausedScene');
    }

    restartGame(prevScene) {
      this.scene.stop(prevScene);
      this.scene.start(prevScene);
      this.timer = 0;
  }
  gotoTuto() {
    this.scene.start('TutoScene', {
        musicOn: this.musicOn,
        returnScene: 'PausedScene'
    });
    console.log('fleche touché');
}

    quitGame() {
        this.scene.stop('MainScene');
        this.scene.start('MenuScene');
    }
}

export class TutoScene extends BaseScene {
    constructor() {
        super({
            key: 'TutoScene'
        });
    }

    init(data) {
        this.returnScene = data.returnScene;
    }

    create() {
        let bg = this.add.image(0, 0, 'backgroundOptions').setOrigin(0, 0);
        let scaleX = this.cameras.main.width / bg.width;
        let scaleY = this.cameras.main.height / bg.height;
        let scale = Math.max(scaleX, scaleY);
        bg.setScale(scale).setScrollFactor(0);

        let title = this.add.text(this.cameras.main.width / 2, 200, 'Tutoriel', { font: '100px', fill: '#000000' }).setOrigin(0.5);

        let touches = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 100, 'Touches :', { font: '50px', fill: '#000000' }).setOrigin(0.5, 0.5);
        let controlImage = this.add.image(this.cameras.main.width / 4, this.cameras.main.height / 2 - 30, 'keyboard').setOrigin(0.5, 0.5);
        let controlText = this.add.text(this.cameras.main.width / 4 * 2, this.cameras.main.height / 2 - 30, "Les touches pour avancer sont les flèches. Pour sauter, appuyez sur la flèche du haut (un double jump est possible mais il faut savoir le dompter)... en gros c'est mal codé mdrr restez bien sur la plateforme", { font: '20px Arial', fill: '#000000', align: 'center', wordWrap: { width: 700, useAdvancedWrap: true } }).setOrigin(0.5, 0.5);

        let gameObjective = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 100, 'But du jeu :', { font: '50px', fill: '#000000' }).setOrigin(0.5);
        let beeImage = this.add.image(this.cameras.main.width / 4 -50, this.cameras.main.height / 2 + 180, 'enemy').setOrigin(0.5);
        let coinImage = this.add.image(this.cameras.main.width / 4 + 50, this.cameras.main.height / 2 + 180, 'star').setOrigin(0.5);
        let gameDescription = this.add.text(this.cameras.main.width / 4 * 2, this.cameras.main.height / 2 + 200, 'Le principe est de tuer tous les enemis en leur sautant dessus et de récolter chaque pièce dans le temps imparti (2:00)', { font: '20px Arial', fill: '#000000', align: 'center', wordWrap: { width: 700, useAdvancedWrap: true } }).setOrigin(0.5);

        let bonus = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 300, 'Bonus :', { font: '50px', fill: '#000000' }).setOrigin(0.5);
        let magicHat = this.add.image(this.cameras.main.width / 4 -50, this.cameras.main.height / 2 + 370, 'magic-cap').setOrigin(0.5);
        let rickImage = this.add.image(this.cameras.main.width / 4 +50, this.cameras.main.height / 2 + 370, 'rick-7').setOrigin(0.5);
        let bonusDescription = this.add.text(this.cameras.main.width / 4 * 2, this.cameras.main.height / 2 + 390, 'Récoltez la casquette et appuyez sur Ctrl pour utiliser le mode fou d\'Odin. Restez appuyé sur B pour débloquer un power-up spécial.', { font: '20px Arial', fill: '#000000', align: 'center', wordWrap: { width: 700, useAdvancedWrap: true } }).setOrigin(0.5);
        
        const backButton = this.add.image(100, 100, 'backButton').setInteractive().setScale(1.5);
    backButton.on('pointerdown', () => this.scene.start(this.returnScene));
    }
}