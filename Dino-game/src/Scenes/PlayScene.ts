import Phaser from "phaser";

class PlayScene extends Phaser.Scene{
    constructor(){
        super('PlayScene');
    }

    get gameHeight(){
        return this.game.config.height as number
    }

    create(){
        
        this.add.tileSprite(0, this.gameHeight, 88, 26, 'ground').setOrigin(0, 1)
    }
}

export default PlayScene;