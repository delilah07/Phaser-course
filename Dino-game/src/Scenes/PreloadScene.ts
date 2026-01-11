import Phaser from "phaser";

class PreloadScene extends Phaser.Scene{
    constructor(){
        super('PreloadScene');
    }

    preload(){
        this.load.image('ground', './assets/ground.png');
        this.load.image('dino-idle', './assets/dino-idle-2.png');
        this.load.spritesheet('dino-run-sprite','./assets/dino-run.png', {
            frameWidth: 88,
            frameHeight: 94
        });

        this.load.image('obstacle-1-img', './assets/cactuses_1.png');
        this.load.image('obstacle-2-img', './assets/cactuses_2.png');
        this.load.image('obstacle-3-img', './assets/cactuses_3.png');
        this.load.image('obstacle-4-img', './assets/cactuses_4.png');
        this.load.image('obstacle-5-img', './assets/cactuses_5.png');
        this.load.image('obstacle-6-img', './assets/cactuses_6.png');
    }

    create(){
        this.scene.start('PlayScene');
    }
}

export default PreloadScene;