// // import { LeaderBoard } from 'phaser3-rex-plugins/plugins/firebase-components'
// // import 'regenerator-runtime'
// // import ParallaxHelper from "../helpers/parallax-helper";
// import { initializeApp } from "firebase/app";
// import { getDatabase, ref, set, get, update, child } from 'firebase/database';

// const firebaseConfig = {
//     apiKey: "AIzaSyA4TcioliWF9Fs_lYdgEqbRVJcDmETwS7A",
//     authDomain: "tutogame-df698.firebaseapp.com",
//     projectId: "tutogame-df698",
//     storageBucket: "tutogame-df698.appspot.com",
//     messagingSenderId: "1032239802459",
//     appId: "1:1032239802459:web:9b7c370a32120b7528b77e",
//     measurementId: "G-9BEKPDNTS6"
// }

// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);

// export default class LeaderboardScene extends Phaser.Scene {
// 	constructor(scene = null) {
// 	   super('LeaderboardScene');
 
// 	   this.sceneRef = scene;
// 	}
 
// 	create() {
// 	   const { width, height } = this.scale;
// 	   const totalWidth = width * 2.5;
 
// 	   this.sound.pauseOnBlur = false;
 
// 	   this.bgSound = this.sound.add('scene1-audio');
 
// 	   if (!this.sound.locked) {
// 		  // already unlocked so play
// 		  this.bgSound.play({
// 			 loop: true,
// 			 volume: 0.1,
// 		  });
// 	   } else {
// 		  // wait for 'unlocked' to fire and then play
// 		  this.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
// 			 this.bgSound.play({
// 				loop: true,
// 				volume: 0.1,
// 			 });
// 		  });
// 	   }
 
// 	   this.add.image(0, 0, 'sky')
// 	   .setScrollFactor(0)
// 	   .setOrigin(0, 0)
// 	   .setScale(1.2)
// 	   .setTint('0x888888');
 
// 	   ParallaxHelper.createParallaxBg(this, totalWidth, 180, 'cloud', 0.1, '0x888888');
// 	   ParallaxHelper.createParallaxBg(this, totalWidth, 300, 'mountain', 0.4, '0x888888');
// 	   ParallaxHelper.createParallaxBg(this, totalWidth, 385, 'pine1', 0.8, '0x888888');
// 	   ParallaxHelper.createParallaxBg(this, totalWidth, 505, 'pine2', 1, '0x888888');
 
// 	   this.happyCat = this.add.sprite(390, 70, 'player').setScale(2);
 
// 	   if (!this.anims.exists('finish-animation')) {
// 		  this.anims.create({
// 			 key: 'finish-animation',
// 			 frames: this.anims.generateFrameNumbers('player', { start: 0, end: 15 }),
// 			 frameRate: 10,
// 			 repeat: -1,
// 			 yoyo: true,
// 		  });
// 	   }
 
// 	   this.happyCat.play('finish-animation');
 
// 	   this.textFinish = this.add.text(this.scale.width / 2.4, this.scale.height / 3.6, `
// 	   Excellent!
// 	   Thanks to you, the kitten
// 	   was able to get home
// 	   successfully!
// 	   `, {
// 		  fill: '#ffffff',
// 		  font: '24px Public Pixel',
// 		  lineSpacing: 10,
// 	   }).setOrigin(0.5);
 
// 	   this.getDataFromFirebase().then((data) => {
// 		  let filteredData = data.sort((a, b) => b.score - a.score);
 
// 		  if (data.length < 9 || filteredData[8].score < this.registry.get('score')) {
// 			 this.createForm();
// 		  } else {
// 			 const btnToMenu = this.add.text(400, 400, 'Press ENTER to go to the menu', {
// 				font: '18px Public Pixel',
// 				fill: '#ffffff',
// 			 }).setOrigin(0.5);
 
// 			 btnToMenu.setInteractive();
// 			 btnToMenu.on('pointerdown', () => {
// 				this.sound.play('sound-btn', {
// 				   volume: 0.1,
// 				});
// 				this.bgSound.stop();
// 				this.scene.start('MenuScene');
// 			 });
 
// 			 this.input.keyboard.on('keydown-ENTER', () => {
// 				this.sound.play('sound-btn', {
// 				   volume: 0.1,
// 				});
// 				this.bgSound.stop();
// 				this.scene.start('MenuScene');
// 			 });
// 		  }
// 	   });
// 	}
 
// 	createForm() {
// 	   //text
// 	   const textForForm = this.add.text(this.scale.width / 2.5, this.textFinish.y + 130, `
// 			 Enter your name to save
// 		  your score on the leaderboard!
// 	   `, {
// 		  fill: '#FFBA7E',
// 		  font: '16px Public Pixel',
// 		  lineSpacing: 10,
// 	   }).setOrigin(0.5).setDepth(0);
 
// 	   //field
// 	   this.playerNameText = this.add.text(this.scale.width / 2, this.scale.height / 2 + 90, '', {
// 		  font: '22px Public Pixel',
// 		  fill: '#ffffff',
// 	   }).setOrigin(0.5, 0.5).setDepth(0);
 
// 	   //underline
// 	   const underline = this.add.graphics();
// 	   underline.lineStyle(2, 0xffffff, 1);
 
// 	   underline.moveTo(220, 360);
// 	   underline.lineTo(570, 360);
// 	   underline.strokePath();
 
// 	   //event
// 	   this.input.keyboard.on('keydown', (event) => {
// 		  if (event.key.match(/^[a-zA-Zа-яА-Я0-9]$/) && this.playerNameText.text.length < 15) {
// 			 this.playerNameText.text += event.key;
// 		  } else if (event.key === 'Backspace' && this.playerNameText.text.length > 0) {
// 			 this.playerNameText.text = this.playerNameText.text.slice(0, -1);
// 		  }
// 	   });
 
// 	   //save
// 	   const saveButton = this.add.text(this.scale.width / 2, this.playerNameText.y + 60, 'Save', {
// 		  fill: '#ffffff',
// 		  font: '24px Public Pixel',
// 	   }).setOrigin(0.5).setDepth(0);
 
// 	   saveButton.setInteractive({
// 		  useHandCursor: true,
// 	   });
// 	   saveButton.on('pointerdown', () => {
// 		  this.sound.play('sound-btn', {
// 			 volume: 0.1,
// 		  });
 
// 		  const points = this.registry.get('score');
// 		  const idPlayer = Date.now();
 
// 		  if (this.playerNameText.text === '') return;
 
// 		  this.playerNameText.setVisible(false);
// 		  underline.setVisible(false);
// 		  saveButton.setVisible(false);
// 		  this.textFinish.setVisible(false);
// 		  this.happyCat.setVisible(false);
// 		  textForForm.setVisible(false);
 
// 		  this.saveToFirebase(this.playerNameText.text, points, idPlayer);
// 		  this.playerNameText.text = '';
// 		  this.showDataFromFirebase();
// 	   });
 
// 	   saveButton.on('pointerover', () => {
// 		  saveButton.setFill('#FFBA7E');
// 		  this.sound.play('sound-menu-change', {
// 			 volume: 0.1,
// 		  });
// 	   });
// 	   saveButton.on('pointerout', () => {
// 		  saveButton.setFill('#FFFFFF');
// 	   });
// 	}
 
// 	saveToFirebase(name, score = 10, id) {
// 	   set(ref(database, 'leaders/' + id), {
// 		  name,
// 		  score,
// 	   })
// 	   .catch(error => console.log(error));
// 	}
 
// 	async getDataFromFirebase() {
// 	   return get(ref(database, 'leaders'))
// 	   .then(snapshot => {
// 		  if (snapshot.exists) {
// 			 let obj = snapshot.val();
// 			 let result = Object.values(obj).reduce((acc, item) => {
// 				   acc.push(item);
// 				return acc;
// 			 }, []);
// 				return result;
// 		  }
// 	   })
// 	   .catch(error => console.log(error));
// 	}
 
// 	showDataFromFirebase() {
// 	   this.getDataFromFirebase().then((data) => {
// 		  let filteredData = data.sort((a, b) => b.score - a.score).slice(0, 9);
 
// 		  if (this.sceneRef) {
// 			 this.drawLeaderboard(this.sceneRef, filteredData);
// 		  } else {
// 			 this.drawLeaderboard(this, filteredData);
// 		  }
// 	   })
// 	   .catch(error => console.log(error));
// 	}
 
// 	drawLeaderboard(scene, data) {
// 	   const x = 128;
// 	   let y = 90;
 
// 	   const leaderboardContainer = scene.add.container();
// 	   leaderboardContainer.visible = true;
// 	   leaderboardContainer.setDepth(1);
 
// 	   const rectangle = scene.add.graphics({ fillStyle: { color: 0x000000, alpha: 0.7 } })
// 	   .fillRoundedRect(96, 20, 600, 470, 15)
// 	   .setDepth(-1);
 
// 	   leaderboardContainer.add(rectangle);
 
// 	   const closeLeaderboard = scene.add.text(scene.scale.width / 2, 50, 'CLOSE', {
// 		  font: '16px Public Pixel',
// 		  fill: '#ffffff',
// 	   }).setOrigin(0.5);
 
// 	   leaderboardContainer.add(closeLeaderboard);
 
// 	   closeLeaderboard.setInteractive({
// 		  useHandCursor: true,
// 	   });
// 	   closeLeaderboard.on('pointerdown', () => {
// 		  leaderboardContainer.visible = false;
// 		  scene.sound.play('sound-btn', {
// 			 volume: 0.1,
// 		  });
 
// 		  if (this.sceneRef) {
// 			 this.sceneRef.enableButtons();
// 		  } else {
// 			 this.bgSound.stop();
// 			 this.scene.stop('LeaderboardScene');
// 			 this.scene.start('MenuScene');
// 		  }
// 	   });
// 	   closeLeaderboard.on('pointerover', () => {
// 		  closeLeaderboard.setFill('#FFBA7E');
// 		  scene.sound.play('sound-menu-change', {
// 			 volume: 0.1,
// 		  });
// 	   });
// 	   closeLeaderboard.on('pointerout', () => {
// 		  closeLeaderboard.setFill('#ffffff');
// 	   });
 
// 	   for (let i = 0; i < data.length; ++i) {
// 		  const num = scene.add.text(x, y, `${i + 1}.`, {
// 			 font: '16px Public Pixel',
// 			 color: '#ffffff',
// 			 backgroundColor: '#FF8041',
// 			 padding: { left: 10, right: 10, top: 10, bottom: 10 }
// 		  }).setOrigin(0, 0.5);
 
// 		  const name = scene.add.text(num.x + num.width + 10, y, data[i].name, {
// 			 font: '16px Public Pixel'
// 		  }).setOrigin(0, 0.5);
 
// 		  const nameWidth = 400;
// 		  const scoreText = scene.add.text(name.x + nameWidth + 10, y, data[i].score.toString(), {
// 			 font: '16px Public Pixel'
// 		  }).setOrigin(0, 0.5);
 
// 		  y += 45;
 
// 		  leaderboardContainer.add(num);
// 		  leaderboardContainer.add(name);
// 		  leaderboardContainer.add(scoreText);
// 	   }
// 	}
//  }