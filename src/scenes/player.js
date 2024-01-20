export class HUD{
    constructor(scene, x, y, key) {
        this.scene = scene;
    
      this.scoreText = this.scene.add.text(60, 20, 'x 0', {
        fontSize: '32px',
        fill: '#000'
    }).setOrigin(0).setScrollFactor(0);
  
      this.capText = this.scene.add.text(240, 20, 'x 0', {
          fontSize: '32px',
          fill: '#000'
      }).setOrigin(0).setScrollFactor(0);
  
      this.coinImage = this.scene.add.image(20, 40, 'star').setScrollFactor(0).setDepth(2);
      this.coinImage.setScale(0.5);
  
      this.capImage = this.scene.add.image(200, 40, 'magic-cap').setScrollFactor(0).setDepth(2);
      this.capImage.setScale(0.5);
  
      console.log(this.capText);
    }
  
    update(capScore, score) {
      if (!this.capText) {
        console.log('capText is undefined');
      } else {
        this.capText.setText('x ' + capScore);
      }
      
      if (!this.scoreText) {
        console.log('scoreText is undefined');
      } else {
        this.scoreText.setText('x ' + score);
      }
    }
  }
  export class Inventory{
    constructor(scene, x, y, key) {
        this.scene = scene;
        this.contents = {};
        this.superModeCountDown = 0;
    }

    update() {
        this.superModeCountDown = Math.max(0, this.superModeCountDown - 1);
    }

    addItem(item, quantity = 1) {
        if (this.contents[item]) this.contents[item] += quantity;
        else this.contents[item] = quantity;
    }

    removeItem(item, quantity = 1) {
        if (this.contents[item]) {
            this.contents[item] -= quantity;
            if (this.contents[item] <= 0) delete this.contents[item];
        }
    }

    getContents() {
        return this.contents;
    }
}

export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        this.setTint(0xffffff); //défini la teinte de l'asset du joueur
        this.scene = scene;
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setScale(1.2, 1.2);
        this.body.setSize(this.width, this.height);
        this.canDoubleJump = false;
        this.keyB = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
        this.keyCtrl = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);
        this.rickSong = this.scene.sound.add('rickSong');
        this.crazyMagic = this.scene.sound.add('crazyMagic');
        this.inventory = new Inventory();
        this.isRickAnimationPlaying = false;
        this.superModeActive = false;
        this.hyperJump = false;
        this.invincible = false;
        this.setInvincible(); //voir fonction plus loin mais permet l'invulnérabilité
    }

    update(cursors, keyB) {
        const didPressJump = Phaser.Input.Keyboard.JustDown(cursors.up);
        const originalJumpState = -425 * 1.5;
    if (didPressJump && this.body.onFloor()) {
        this.body.setVelocityY((this.superModeActive && this.hyperJump) ? -1000 : originalJumpState);
        this.canDoubleJump = true;
    } 
    else if (this.canDoubleJump && didPressJump) { 
        this.body.setVelocityY((this.superModeActive && this.hyperJump) ? -1000 : originalJumpState);
        this.canDoubleJump = false;
    }
  


      if(!this.isRickAnimationPlaying) {
        const originalSpeedState = 160 * 2; 
        const superSpeedState = originalSpeedState * 3;

        if (cursors.left.isDown) {  
            this.setVelocityX(this.superModeActive && this.hyperJump ? -superSpeedState : -originalSpeedState);
            this.anims.play("playerWalk-left", true);
        } else if (cursors.right.isDown) {
            this.setVelocityX(this.superModeActive && this.hyperJump ? superSpeedState : originalSpeedState);
            this.anims.play("playerWalk-right", true);
        } else if (cursors.up.isDown) {
            this.anims.play("playerJump", true);
        } else {
            this.setVelocityX(0);
            this.anims.play("playerIdle", true);
        }
    }
  
      if (this.keyB.isDown && !this.isRickAnimationPlaying) {
        this.isRickAnimationPlaying = true;
        this.anims.play("playerRick", true);
        this.rickSong.play();
      } else if (this.keyB.isUp && this.isRickAnimationPlaying) {
        this.isRickAnimationPlaying = false;
        this.anims.stop();
        this.rickSong.stop();
      }

      if (Phaser.Input.Keyboard.JustDown(this.keyCtrl)) {
        this.triggerSuperMode();
    }
    }
    triggerSuperMode() {
      const inventory = this.inventory.getContents();
    
      if (inventory["magic-cap"] && inventory["magic-cap"] > 0) {
          this.inventory.removeItem("magic-cap", inventory["magic-cap"]);
          this.scene.hud.update(0, this.scene.score);
          this.playColorAnimation();
          this.superModeActive = true;
          this.hyperJump = true;
          
          this.scene.time.delayedCall(8000, () => {
              this.stopColorAnimation();
              this.superModeActive = false;
              this.hyperJump = false;
          }, [], this);
      }
    }
    playColorAnimation() {
      this.tint = Math.random() * 0xFFFFFF;
      this.crazyMagic.play();
      this.colorAnimation = this.scene.time.addEvent({
          delay: 250,
          callback: () => {
              this.tint = Math.random() * 0xFFFFFF;
          },
          callbackScope: this,
          loop: true
      });
  }
  stopColorAnimation() {
      this.colorAnimation.destroy();
      this.tint = 0xFFFFFF;
      this.crazyMagic.stop();
  }

  setInvincible() {
    this.invincible = true;
    this.scene.time.delayedCall(3000, () => {
        this.invincible = false;
    }, [], this);
}
}