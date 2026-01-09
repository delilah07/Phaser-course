import Phaser from "phaser";
import { Player } from '../entities/Player'

class PlayScene extends Phaser.Scene{
    constructor(){
        super('PlayScene');
    }

    get gameHeight(){
        return this.game.config.height as number
    }

    player: Player;
    startTrigger: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    create(){   
        this.createEnviroment()
        this.createPlayer();

        this.startTrigger = this.physics.add.sprite(0, 10, null).setAlpha(0).setOrigin(0, 1);



        this.physics.add.overlap(this.startTrigger, this.player, () => {
            console.log('collide')
        })
    }

    createEnviroment(){
        this.add.tileSprite(0, this.gameHeight, 88, 26, 'ground').setOrigin(0, 1);
    }

    createPlayer(){
        this.player = new Player(this, 0, this.gameHeight);
    }

    // update(){
     
    // }
}

export default PlayScene;