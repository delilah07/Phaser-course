
import Phaser from "phaser";

const config = {
  type: Phaser.AUTO, // render, default WebGL (Web Graphics Library)
  width: 800,
  height: 600,
  physics: {
    default: 'arcade', // arcade phycics plugin, manages physics simulation
    arcade: {
      debug: true
    }
  },
  scene: {
    preload, //preload: preload,
    create, //create: create,
    update
  }
};

const VELOCITY = 200
const initialBirdPosition = {
  x: config.width / 10,
  y: config.height/ 2
}
const PIPES_TO_RENDER =  4

let bird = null
let flapVelocity = 150

let pipes = null

let pipeVerticalDistanceRange = [150, 250]
let pipeHorizontalDistanceRange = [400,600]

let totalDelta = null

new Phaser.Game(config);

// loading assets, such as images, music, animations
function preload () {
  // this context - scene
  // contains functions and properties of this scene
  this.load.image('sky', 'assets/sky.png');
  this.load.image('bird', 'assets/bird.png');
  this.load.image('pipe', 'assets/pipe.png');
}


// initialization 
function create () {
  // x, y, key of image
  // image has 0,0 coordinates in the middle 
  // this.add.image(0, 0, 'sky');

  // this.add.image(config.width / 2, config.height / 2, 'sky'); // or
  this.add.image(0, 0, 'sky').setOrigin(0, 0);

  bird = this.physics.add.sprite(initialBirdPosition.x, initialBirdPosition.y, 'bird');
  bird.body.gravity.y = 400
  
  pipes = this.physics.add.group();

  for (let i = 0; i < PIPES_TO_RENDER; i++) {
    const upperPipe = pipes.create(0, 0, 'pipe').setOrigin(0, 1);
    const lowerPipe = pipes.create(0, 0, 'pipe').setOrigin(0, 0);

    placePipe(upperPipe, lowerPipe)
  }

  pipes.setVelocityX(-200)

  this.input.on('pointerdown', flap)
  this.input.keyboard.on('keydown-SPACE', flap)
}

// default 60fps (times per second) = 60 * 16,3ms = 1000ms 
function update(time, delta){

  // coallision with top and bottom
  if (bird.y >= config.height - bird.height / 2 || bird.y <= 0 + bird.height / 2) {
    restartBirdPosition()
  } 

  recyclePipe()
}

function flap(){
  bird.body.velocity.y = -flapVelocity
}

function restartBirdPosition(){
  bird.x = initialBirdPosition.x
  bird.y = initialBirdPosition.y
}

function placePipe(uPipe, lPipe, i){
  const rightMostX = getRightMostPipe()
  const pipeVerticalDistance = Phaser.Math.Between(...pipeVerticalDistanceRange)
  const pipeVerticalPosition = Phaser.Math.Between(20, config.height - 20 - pipeVerticalDistance)

  const pipeHorizontalDistance = Phaser.Math.Between(...pipeHorizontalDistanceRange)

  uPipe.x = rightMostX + pipeHorizontalDistance
  console.log(uPipe.x)
  uPipe.y = pipeVerticalPosition
  
  lPipe.x = uPipe.x
  lPipe.y = uPipe.y + pipeVerticalDistance

}

function recyclePipe(){
  let tempPipes = []
  pipes.getChildren().forEach(pipe => {
    if (pipe.getBounds().right <= 0) {
      // recycle pipe
      tempPipes.push(pipe)
      if (tempPipes.length === 2){
        placePipe(...tempPipes)
      }
      // add new pipes
    }
  })
}

function getRightMostPipe(){
  let rightMostX = 0;

  pipes.getChildren().forEach(pipe => {
    rightMostX = Math.max(pipe.x, rightMostX)
  });

  return rightMostX
}