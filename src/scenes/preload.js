export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'PreloadScene'
        })
    }
    preload() {
        this.load.image('player', 'assets/images/stand.png');
        this.load.image('player-left', 'assets/images/stand-left.png');
        this.load.image('player-right', 'assets/images/stand-right.png');
        this.load.image('background', 'assets/images/background.jpg');
        this.load.image('backgroundMenu', 'assets/images/backgroundMenu.png');
        this.load.image('backgroundOptions', 'assets/images/backgroundOptions.jpg');
        this.load.image('run1-right', 'assets/images/walking1-right.png');
        this.load.image('run2-right', 'assets/images/walking2-right.png');
        this.load.image('run1-left', 'assets/images/walking1-left.png');
        this.load.image('run2-left', 'assets/images/walking2-left.png');
        this.load.image('keyboard', 'assets/images/keyboard.png');
        this.load.image('jump', 'assets/images/jump.png');
        this.load.image('backButton', 'assets/images/backMenu.png');
        this.load.audio('clickSound', 'assets/audio/buttonSoundEffect.mp3');
        this.load.audio('backgroundMusic', 'assets/audio/backgroundMusic.mp3');
        this.load.audio('coinCollect', 'assets/audio/coin-collect.mp3');
        this.load.audio('enemyDeath', 'assets/audio/enemydeath.mp3');
        this.load.audio('cap', 'assets/audio/cap.mp3');
        this.load.audio('crazyMagic', 'assets/audio/crazyMagic.mp3');
        this.load.audio('scream', 'assets/audio/scream.mp3');
        this.load.audio('rickSong', 'assets/audio/rick-song.mp3');
        this.load.audio('failure', 'assets/audio/failure.mp3');
        this.load.audio('victory', 'assets/audio/victory.mp3');
        this.load.audio('explosion', 'assets/audio/explosion.mp3');
        this.load.image('star', 'assets/images/coin-1.png');
        this.load.image('coin-2', 'assets/images/coin-2.png');
        this.load.image('coin-3', 'assets/images/coin-3.png');
        this.load.image('coin-4', 'assets/images/coin-4.png');
        this.load.image('coin-5', 'assets/images/coin-5.png');
        this.load.image('magic-cap', 'assets/images/magic-cap.png');
        this.load.image('rick-1', 'assets/images/rick-1.png');
        this.load.image('rick-2', 'assets/images/rick-2.png');
        this.load.image('rick-3', 'assets/images/rick-3.png');
        this.load.image('rick-4', 'assets/images/rick-4.png');
        this.load.image('rick-5', 'assets/images/rick-5.png');
        this.load.image('rick-6', 'assets/images/rick-6.png');
        this.load.image('rick-7', 'assets/images/rick-7.png');
        this.load.image('rick-8', 'assets/images/rick-8.png');
        this.load.image('enemy', 'assets/images/bee-enemy.png');
        this.load.image('enemy2', 'assets/images/bee-enemy2.png');
        this.load.image('enemy3', 'assets/images/bee-enemy3.png');
        this.load.image('enemy-reversed', 'assets/images/bee-enemy-reversed.png');
        this.load.image('enemy2-reversed', 'assets/images/bee-enemy2-reversed.png');
        this.load.image('enemy3-reversed', 'assets/images/bee-enemy3-reversed.png');
        this.load.image('block', 'assets/images/block.png');
        this.load.image('block-death', 'assets/images/block-death.png');
    }
    create() {
        this.scene.start('MenuScene')

    }
}