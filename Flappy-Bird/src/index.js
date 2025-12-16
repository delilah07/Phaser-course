
import Phaser from "phaser";

const config = {
  type: Phaser.AUTO, // render, default WebGL (Web Graphics Library)
  width: 800,
  height: 600,
  physics: {
    default: 'arcade', // arcade phycics plugin, manages physics simulation
    arcade: {
      gravity: { y: 400 },
      debug: true
    }
  },
  scene: {
    preload, //preload: preload,
    create, //create: create,
    update
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

const VELOCITY = 200

let bird = null
let flapVelocity = 150
let totalDelta = null

// initialization 
function create () {
  // x, y, key of image
  // image has 0,0 coordinates in the middle 
  // this.add.image(0, 0, 'sky');

  // this.add.image(config.width / 2, config.height / 2, 'sky'); // or
  this.add.image(0, 0, 'sky').setOrigin(0,0);

  bird = this.physics.add.sprite(config.width / 10, config.height / 2, 'bird');
  // bird.body.velocity.y = 200 // 200pixels per seconds, the same as bird.body.gravity.y = 200
  
  this.input.on('pointerdown', flap)
  this.input.keyboard.on('keydown-SPACE', flap)
}

// default 60fps (times per second) = 60 * 16,3ms = 1000ms 
function update(time, delta){
  // console.log(time, delta)
  // console.log(bird.body.velocity.y, bird.body.gravity.y)

  // coallision left and right
  // if bird position x is same or larger than width of canvas go back to the left
  // if bird position x is smaller or equal to 0 go back to the right
  // if (bird.x >= config.width - bird.width / 2) {
  //   bird.body.velocity.x = -VELOCITY
  // } else if (bird.x <= 0 + bird.width / 2) {
  //   bird.body.velocity.x = VELOCITY
  // }
}

function flap(){
  bird.body.velocity.y = -flapVelocity
}