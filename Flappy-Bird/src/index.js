
import Phaser from "phaser";

import PlayScene from "./scenes/playScene";
import MenuScene from "./scenes/menuScene";
import PreloadScene from "./scenes/preloadScene";
import ScoreScene from "./scenes/scoreScene";
import StartScene from "./scenes/startScene";

const WIDTH = 800
const HEIGHT = 600
const BIRD_POSITION = {
  x: WIDTH / 10,
  y: HEIGHT/ 2
}
const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: BIRD_POSITION
}

const Scenes = [PreloadScene, MenuScene, PlayScene, ScoreScene, StartScene]
const initScenes = () => Scenes.map(scene => new scene(SHARED_CONFIG))

const config = {
  type: Phaser.AUTO, // render, default WebGL (Web Graphics Library)
  ...SHARED_CONFIG,
  physics: {
    default: 'arcade', // arcade phycics plugin, manages physics simulation
    arcade: {
      debug: true
    }
  },
  scene: initScenes()
};

new Phaser.Game(config);



