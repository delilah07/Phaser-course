

import Phaser from "phaser";

import PreloadScene from "./scenes/Preload";
import PlayScene from "./scenes/Play";

const WIDTH = 1280
const HEIGHT = 600

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT
}

const Scenes = [PreloadScene, PlayScene]
const initScenes = () => Scenes.map(scene => new scene(SHARED_CONFIG))

const config = {
  type: Phaser.AUTO, // render, default WebGL (Web Graphics Library)
  ...SHARED_CONFIG,
  pixelArt: true,
  physics: {
    default: 'arcade', // arcade phycics plugin, manages physics simulation
    arcade: {
      // debug: true
    }
  },
  scene: initScenes()
};

new Phaser.Game(config);

