import { Player, HUD, Inventory } from './player.js';

export default class MainScene extends Phaser.Scene {
    cursors
    player
    enemy
    timer = 0;
    timerText = null;
    gameIsFinished = false;

    constructor() {
        super({
            key: 'MainScene'
        });
        this.enemiesCount = 0;
    }

    create() {
      this.timer = 0;
    this.gameIsFinished = false;
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.launch('PausedScene', {
                prevScene: 'MainScene'
            });
            this.scene.pause();
        });

        this.anims.create({
            key: "playerWalk-right",
            frames: [{
                    key: "run1-right"
                },
                {
                    key: "run2-right"
                },
            ],
            frameRate: 7,
            repeat: -1
        });


        this.anims.create({
            key: "playerWalk-left",
            frames: [{
                    key: "run1-left"
                },
                {
                    key: "run2-left"
                },
            ],
            frameRate: 7,
            repeat: -1
        });

        let frames = [];
        let animationsWaiting = [{
                key: "player",
                repeats: 5
            },
            {
                key: "player-left",
                repeats: 10
            },
            {
                key: "player",
                repeats: 10
            },
            {
                key: "player-right",
                repeats: 10
            },
            {
                key: "player",
                repeats: 6
            },
        ];
        animationsWaiting.forEach(animation => {
            for (let i = 0; i < animation.repeats; i++) {
                frames.push({
                    key: animation.key
                });
            }
        });


        this.anims.create({
            key: "playerIdle",
            frames: frames,
            frameRate: 5,
            repeat: -1
        });

        function createRepeatedFrames(key, count) {
            var frames = [];
            for (var i = 0; i < count; i++) {
                frames.push({
                    key: key
                });
            }
            return frames;
        }

        this.anims.create({
            key: "playerRick",
            frames: [
                ...createRepeatedFrames("rick-1", 5),
                ...createRepeatedFrames("rick-2", 3),
                ...createRepeatedFrames("rick-3", 3),
                ...createRepeatedFrames("rick-4", 3),
                ...createRepeatedFrames("rick-5", 3),
                ...createRepeatedFrames("rick-6", 3),
                ...createRepeatedFrames("rick-7", 5),
                ...createRepeatedFrames("rick-8", 3)
            ],
            frameRate: 20,
            repeat: -1
        });


        this.anims.create({
            key: "playerJump",
            frames: [{
                key: "jump"
            }],
            frameRate: 1,
        });


        this.anims.create({
            key: "coinRotation",
            frames: [{
                    key: "star"
                },
                {
                    key: "coin-2"
                },
                {
                    key: "coin-3"
                },
                {
                    key: "coin-4"
                },
                {
                    key: "coin-5"
                },
                {
                    key: "coin-2"
                },
                {
                    key: "coin-3"
                },
                {
                    key: "star"
                }
            ],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "bee-enemy",
            frames: [{
                    key: "enemy"
                },
                {
                    key: "enemy2"
                },
                {
                    key: "enemy3"
                },
                {
                    key: "enemy2"
                },
                {
                    key: "enemy"
                },
                {
                    key: "enemy2"
                },
                {
                    key: "enemy3"
                },
                {
                    key: "enemy2"
                },
                {
                    key: "enemy"
                }
            ],
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "bee-enemy-reversed",
            frames: [{
                    key: "enemy-reversed"
                },
                {
                    key: "enemy2-reversed"
                },
                {
                    key: "enemy3-reversed"
                },
                {
                    key: "enemy2-reversed"
                },
                {
                    key: "enemy-reversed"
                },
                {
                    key: "enemy2-reversed"
                },
                {
                    key: "enemy3-reversed"
                },
                {
                    key: "enemy2-reversed"
                },
                {
                    key: "enemy-reversed"
                }
            ],
            frameRate: 10,
            repeat: -1
        });

        let bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
        let scaleX = this.cameras.main.width / bg.width;
        let scaleY = this.cameras.main.height / bg.height;
        let scale = Math.max(scaleX, scaleY);
        bg.setScale(scale).setScrollFactor(0);

        const world = {
            width: 5000,
            height: 1080
        }

        this.cameras.main.setBounds(0, 0, world.width, world.height);
        this.physics.world.setBounds(0, 0, world.width, world.height);


        this.timerText = this.add.text(1720, 16, 'Temps: 2:00', {
                fontSize: '32px',
                fill: '#000'
            })
            .setOrigin(0)
            .setScrollFactor(0);
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                if (!this.gameIsFinished) {
                    this.timer++;

                    let minutes = Math.floor((120 - this.timer) / 60);
                    let seconds = (120 - this.timer) % 60;
                    this.timerText.setText('Temps: ' +
                        (minutes < 10 ? '0' + minutes : minutes) + ':' +
                        (seconds < 10 ? '0' + seconds : seconds)
                    );
                }
            },
            callbackScope: this,
            loop: true
        });
        let enemies = this.physics.add.group();

        for (let i = 0; i < 10; i++) {
            let x = Phaser.Math.Between(100, world.width - 100);
            let y = Phaser.Math.Between(100, world.height - 100);
            let enemy = enemies.create(x, y, 'enemy');
            enemy.setScale(1.2, 1.2);
            enemy.setCollideWorldBounds(true);
            enemy.setGravityY(2);
            enemy.setVelocityX(-300);
            enemy.setVelocityY(0);
            enemy.step = -300;
            enemy.anims.play('bee-enemy', true);

            setInterval(() => {
                if(enemy) {
                    enemy.setVelocityY(-1 * (Math.random() + 1) * 500);
                }
            }, Math.random() * 2000 + 1000);
        }

        this.enemies = enemies;
        this.enemiesCount = enemies.getChildren().length;
        this.player = new Player(this, 0, 0);


        this.magicCap = this.physics.add.sprite(
          Math.floor(Math.random() * world.width),
          Math.floor(Math.random() * world.height),
          'magic-cap'
        );
        this.magicCap.setCollideWorldBounds(true);

        const colorList = [
          0xff0000, 0x0000ff, 0x00ff00, 0xffc0cb, 0xffff00 
        ];
        
        function randomFlashyColor() {
          return colorList[Math.floor(Math.random() * colorList.length)];
        }
        
        this.time.addEvent({
          delay: 100,
          callback: () => {
            let color = randomFlashyColor();
            this.magicCap.setTintFill(color);
          },
          callbackScope: this,
          loop: true
        });

        let stars = this.physics.add.group({
            key: 'star',
            repeat: 59,
            setXY: {
                x: 500,
                y: 0,
                stepX: 70
            }
        })
        stars.children.iterate((child) => {
            child.setScale(1, 1);
            child.setCollideWorldBounds(true);
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.6));
            child.setGravityY(0);
            child.anims.play('coinRotation', true);
            child.setInteractive().on('pointerdown', () => {
                console.log('you hit a star');
            })
        })

        this.score = 0;
        this.capScore = 0;
        this.hud = new HUD(this);


        const collectStar = (player, star) => {
          star.disableBody(true, true);
          player.inventory.addItem("star");
          this.sound.play('coinCollect');
          this.score+= 1;
          this.hud.update(this.capScore, this.score);
          if (this.score >= 60 && this.enemiesCount === 0) {
              this.victory();
          }
      };
        
      const collectCap = (player, cap) => {
        cap.disableBody(true, true);
        player.inventory.addItem("magic-cap");
        this.sound.play('cap');
        this.capScore += 1;
        this.hud.update(this.capScore, this.score);
      };


        function weightedRandom(max, numDice) {
            let num = 0;
            for (let i = 0; i < numDice; i++) {
                num += Math.random() * max;
            }
            return num / numDice;
        }

        let platforms = this.physics.add.staticGroup();
        let deathBlocks = this.physics.add.staticGroup();


        for (let i = 0; i < 50; i++) {
            let x = Math.floor(Math.random() * (world.width - 200) / 100) * 100;
            let y = 200 + Math.floor(weightedRandom(world.height - 200, 2) / 100) * 100;
            const blockDeathProbability = 0.1;


            if (Math.random() > blockDeathProbability) {
                platforms.create(x, y, "block");
            } else {
                deathBlocks.create(x, y, "block-death");
            }

            if (Math.random() > 0.9) {
                if (Math.random() > blockDeathProbability) {
                    platforms.create(x + 100, y, "block");
                } else {
                    platforms.create(x + 100, y, "block-death");
                }
            }

            if (Math.random() > 0.9) {
                if (Math.random() > blockDeathProbability) {
                    platforms.create(x, y + 100, "block");
                } else {
                    platforms.create(x, y + 100, "block-death");
                }

                if (Math.random() > 0.6) {
                    if (Math.random() > blockDeathProbability) {
                        platforms.create(x + 100, y + 100, "block");
                    } else {
                        platforms.create(x + 100, y + 100, "block-death");
                    }
                }
            }

            x += 100;
        }

        this.physics.add.collider(stars, platforms);
        this.physics.add.collider(stars, deathBlocks);
        this.physics.add.collider(this.player, platforms);
        this.physics.add.collider(this.player, deathBlocks, this.touchDeathBlock, null, this);
        this.physics.add.collider(this.enemies, platforms);
        this.physics.add.collider(this.enemies, deathBlocks);
        this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, null, this);
        this.physics.add.overlap(this.player, stars, collectStar, null, this);
        if(this.magicCap) {
          this.physics.add.collider(this.magicCap, platforms);
          this.physics.add.collider(this.magicCap, deathBlocks);
          this.physics.add.overlap(this.player, this.magicCap, collectCap, null, this);
      }
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cameras.main.startFollow(this.player, true);
    }
    touchDeathBlock(player, block) {
        if (!player.invincible) {
          if (!player.superModeActive && block.texture.key === "block-death") {
            this.sound.play('explosion');
            this.endGame("Vous n'auriez pas dû toucher ce bloc");
          }
        }
      }

      hitEnemy(player, enemy) {
          if (!player.invincible) {
              if (player.superModeActive || 
                 (player.body.touching.down && enemy.body.touching.up)) {
      
                  enemy.disableBody(true, true);
                  this.sound.play('enemyDeath');
                  this.enemiesCount -= 1;
                  if (this.score >= 60 && this.enemiesCount === 0) {
                      this.victory();
                  }

              } else {
                  this.sound.play('scream');
                  this.endGame("Les monstres vous ont dévorés");
              }
          }
      }

    update() {
        if (this.timer >= 120) {
            this.endGame("Le chronomètre est écoulé");
            this.timer = 0;
        }

        this.player.update(this.cursors);
        this.enemies.getChildren().forEach(enemy => {
            if (enemy.body.onWall()) {
                enemy.step *= -1;
                if (enemy.step > 0) {
                    enemy.anims.play('bee-enemy-reversed', true);
                } else {
                    enemy.anims.play('bee-enemy', true);
                }
            }
            enemy.setVelocityX(enemy.step);
        });
        this.player.inventory.update();
      }

    endGame(reason = '') {;
        this.physics.pause();
        this.gameIsFinished = true;
        this.sound.get('backgroundMusic').stop();
        this.sound.play('failure');
        this.player.setTint(0xff0000);

        let centerX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        let centerY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        let background = this.add.rectangle(centerX, centerY, this.game.config.width + 300, this.game.config.height + 300, 0x000000);
        background.setDepth(1);

        this.tweens.add({
            targets: background,
            alpha: {
                from: 0,
                to: 1
            },
            duration: 2000
        });

        let gameOver = this.add.text(centerX, centerY, 'Vous \u00EAtes mort. Raison : ' + reason, {
            fontSize: '32px',
            fill: '#ff0000'
        });
        gameOver.setOrigin(0.5);
        gameOver.setDepth(2);

        let replayButton = this.add.text(centerX, centerY + 70, 'Rejouer', {
            fontSize: '32px',
            fill: '#ffffff'
        });
        replayButton.setOrigin(0.5);
        replayButton.setInteractive();
        replayButton.setDepth(2);

        replayButton.on('pointerdown', () => {
            this.scene.restart();
        });
    }
    victory() {
      this.physics.pause();
      this.gameIsFinished = true;
      this.sound.get('backgroundMusic').stop();
      this.sound.play('victory');
      let centerX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
      let centerY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
      let background = this.add.rectangle(centerX, centerY, this.game.config.width + 300, this.game.config.height + 300, 0x00ff00);
      background.setAlpha(0);
      background.setDepth(1);
  
      this.tweens.add({
          targets: background,
          alpha: {
              from: 0,
              to: 1
          },
          duration: 2000
      });
  
      let victoryText = this.add.text(centerX, centerY, 'Vous avez gagn\u00E9 !', {
          fontSize: '64px',
          fill: '#000000'
      });
      victoryText.setOrigin(0.5);
      victoryText.setDepth(2);
  
      let elapsedTime = this.timer; 
let elapsedMinutes = Math.floor(elapsedTime / 60);
let elapsedSeconds = elapsedTime % 60;
let elapsedTimeText = this.add.text(centerX, centerY + 100, 'Temps écoulé : ' +
    (elapsedMinutes < 10 ? '0' + elapsedMinutes : elapsedMinutes) + ':' +
    (elapsedSeconds < 10 ? '0' + elapsedSeconds : elapsedSeconds), 
    {
    fontSize: '32px',
    fill: '#000000'
});
elapsedTimeText.setOrigin(0.5);
elapsedTimeText.setDepth(2);
  
      let replayButton = this.add.text(centerX, centerY + 140, 'Rejouer', {
          fontSize: '32px',
          fill: '#000000'
      });
      replayButton.setOrigin(0.5);
      replayButton.setInteractive();
      replayButton.setDepth(2);
      replayButton.on('pointerdown', () => {
          this.scene.restart();
      });

  }

}
