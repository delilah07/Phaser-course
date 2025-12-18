
import Phaser from "phaser";
import PlayScene from "./scenes/playScene";

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

const config = {
  type: Phaser.AUTO, // render, default WebGL (Web Graphics Library)
  ...SHARED_CONFIG,
  physics: {
    default: 'arcade', // arcade phycics plugin, manages physics simulation
    arcade: {
      debug: true
    }
  },
  scene: [new PlayScene(SHARED_CONFIG)]
};

new Phaser.Game(config);



