import Phaser from 'phaser';

import PreloadScene from './scenes/Preload';
import PlayScene from './scenes/Play';

const MAP_WIDTH = 1600;

const WIDTH = document.body.offsetWidth;
const HEIGHT = 600;
const ZOOM_FACTOR = 1.5;

const SHARED_CONFIG = {
  mapOffset: MAP_WIDTH > WIDTH ? MAP_WIDTH - WIDTH : 0,
  width: WIDTH,
  height: HEIGHT,
  zoomFactor: ZOOM_FACTOR,
  endSize: 300,
  debug: false,
  leftTopCorner: {
    x: (WIDTH - WIDTH / ZOOM_FACTOR) / 2,
    y: (HEIGHT - HEIGHT / ZOOM_FACTOR) / 2,
  },
  rightTopCorner: {
    x: (WIDTH - WIDTH / ZOOM_FACTOR) / 2 + WIDTH / ZOOM_FACTOR,
    y: (HEIGHT - HEIGHT / ZOOM_FACTOR) / 2 + HEIGHT / ZOOM_FACTOR,
  },
};

const Scenes = [PreloadScene, PlayScene];
const initScenes = () => Scenes.map((scene) => new scene(SHARED_CONFIG));

const config = {
  type: Phaser.AUTO, // render, default WebGL (Web Graphics Library)
  ...SHARED_CONFIG,
  pixelArt: true,
  physics: {
    default: 'arcade', // arcade phycics plugin, manages physics simulation
    arcade: {
      debug: SHARED_CONFIG.debug,
    },
  },
  scene: initScenes(),
};

new Phaser.Game(config);
