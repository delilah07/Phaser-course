import Phaser from "phaser";

class PreloadScene extends Phaser.Scene{
    constructor(){
        super('PreloadScene')
    }
    
    preload(){
        this.load.image('sky', 'assets/sky.png');
        // this.load.image('bird', 'assets/bird.png');
        this.load.spritesheet('bird', 'assets/big-sprite.png', {
            frameWidth: 209,
            frameHeight: 209
        })
        this.load.image('pipe', 'assets/pipe.png');
        this.load.image('pause', 'assets/pause.png');
        this.load.image('back', 'assets/back.png');
        this.load.image('logo', 'assets/game-logo.png');
    }

    create(){
        this.scene.start('StartScene')
    }
}

export default PreloadScene;