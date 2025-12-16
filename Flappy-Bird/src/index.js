
import Phaser from "phaser";

const config = {
  type: Phaser.AUTO, // render, default WebGL (Web Graphics Library)
  width: 800,
  height: 600,
  physics: {
    default: 'arcade', // arcade phycics plugin, manages physics simulation
    arcade: {
      gravity: { y: 200 }
    }
  },
  scene: {
    preload, //preload: preload,
    create //create: create,
  }
};

new Phaser.Game(config);

// loading assets, such as images, music, animations
function preload () {
  // this context - scene
  // contains functions and properties of this scene
  this.load.image('sky', 'assets/sky.png');
  this.load.image('bird', 'assets/bird.png');
}

let bird = null

// initialization 
function create () {
  // x, y, key of image
  // image has 0,0 coordinates in the middle 
  // this.add.image(0, 0, 'sky');

  // this.add.image(config.width / 2, config.height / 2, 'sky'); // or
  this.add.image(0, 0, 'sky').setOrigin(0,0);
  bird = this.add.sprite(config.width / 10, config.height / 2, 'bird');
}
