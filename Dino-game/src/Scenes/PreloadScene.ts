import Phaser from "phaser";
import { PRELOAD_CONFIG } from '..'

class PreloadScene extends Phaser.Scene{
    constructor(){
        super('PreloadScene');
    }

    preload(){
        this.load.image('ground', './assets/ground.png');

        this.load.image('dino-idle', './assets/dino-idle-2.png');
        this.load.image('dino-hurt-image', './assets/dino-hurt.png');
        this.load.spritesheet('dino-run-sprite','./assets/dino-run.png', {
            frameWidth: 88,
            frameHeight: 94
        });

        for (let i = 0; i < PRELOAD_CONFIG.cactusesCount; i++) {
            const cactusNum = i + 1;
            this.load.image(`obstacle-${cactusNum}-img`, `./assets/cactuses_${cactusNum}.png`);
        }

        this.load.image('restart-image', './assets/restart.png');
        this.load.image('game-over-image', './assets/game-over.png');
    }

    create(){
        this.scene.start('PlayScene');
    }
}

export default PreloadScene;