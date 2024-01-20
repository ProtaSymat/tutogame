import PreloadScene from './src/scenes/preload.js';
import { BaseScene, MenuScene, OptionsScene, PausedScene, TutoScene } from './src/scenes/menu.js';
import MainScene from './src/scenes/mainscene.js';
const DEFAULT_WIDTH = 1920;
const DEFAULT_HEIGHT = 880;
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;
const SCALE_MODE = 'SMOOTH';

function resizeGame(game) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    let width = DEFAULT_WIDTH;
    let height = DEFAULT_HEIGHT;
    let maxWidth = MAX_WIDTH;
    let maxHeight = MAX_HEIGHT;
    let scaleMode = SCALE_MODE;
    let scale = Math.min(w / width, h / height);
    let newWidth = Math.min(w / scale, maxWidth);
    let newHeight = Math.min(h / scale, maxHeight);
    let defaultRatio = DEFAULT_WIDTH / DEFAULT_HEIGHT;
    let maxRatioWidth = MAX_WIDTH / DEFAULT_HEIGHT;
    let maxRatioHeight = DEFAULT_WIDTH / MAX_HEIGHT;
    let smooth = 1;
    if (scaleMode === 'SMOOTH') {
        const maxSmoothScale = 1.15;
        const normalize = (value, min, max) => {
            return (value - min) / (max - min);
        };
        if (width / height < w / h) {
            smooth = -normalize(newWidth / newHeight, defaultRatio, maxRatioWidth) / (1 / (maxSmoothScale - 1)) + maxSmoothScale;
        } else {
            smooth = -normalize(newWidth / newHeight, defaultRatio, maxRatioHeight) / (1 / (maxSmoothScale - 1)) + maxSmoothScale;
        }
    }

    game.scale.resize(newWidth * smooth, newHeight * smooth);
    game.canvas.style.width = newWidth * scale + 'px';
    game.canvas.style.height = newHeight * scale + 'px';
    game.canvas.style.marginTop = `${(h - newHeight * scale) / 2}px`;
    game.canvas.style.marginLeft = `${(w - newWidth * scale) / 2}px`;
}

window.addEventListener('load', () => {
    const game = new Phaser.Game({
        backgroundColor: '0x000000',
        parent: 'phaser-game',
        fps: {target: 40},
   render: {
      pixelArt: true
   },
scale: {
    mode: Phaser.Scale.FIT,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
},
        type: Phaser.AUTO,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: {
                    y: 1200
                },
                debug: false
            }
        },
scene: [PreloadScene, BaseScene, MenuScene, OptionsScene, MainScene, PausedScene, TutoScene],
    });
    window.addEventListener('resize', event => {
        resizeGame(game);
    });
    resizeGame(game);
});


// window.onerror = function(message, url, lineNumber) {
//   console.log("Error: "+message+" in "+url+" at line "+lineNumber);
// }


// window.addEventListener('resize', () => { resizeGame(game); });