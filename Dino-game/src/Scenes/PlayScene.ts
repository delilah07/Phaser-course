import Phaser from "phaser";
import { Player } from '../entities/Player'

class PlayScene extends Phaser.Scene{
    constructor(){
        super('PlayScene');
    }

    get gameHeight(){
        return this.game.config.height as number
    }

    get gameWidth(){
        return this.game.config.width as number
    }

    player: Player;
    startTrigger: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    ground: Phaser.GameObjects.TileSprite;
    isGameRunning: boolean = false;

    create(){   
        this.createEnviroment()
        this.createPlayer();

        this.startTrigger = this.physics.add.sprite(0, 10, null).setAlpha(0).setOrigin(0, 1);



        this.physics.add.overlap(this.startTrigger, this.player, () => {
            if (this.startTrigger.y === 10) {
                this.startTrigger.body.reset(0, this.gameHeight);
                return;
            }

            this.startTrigger.body.reset(9999, 9999);

            const rollOutEvent = this.time.addEvent({
                delay: 1000 / 60,
                loop: true,
                callback: () => {
                    this.ground.width += 34;
                    this.player.setVelocityX(80);
                    this.player.playRunAnim()

                    if (this.ground.width >= this.gameWidth) {
                        rollOutEvent.remove();
                        this.ground.width = this.gameWidth;
                        this.player.setVelocityX(0);
                        this.isGameRunning = true;
                    }
                }
            })

        })
    }

    createEnviroment(){
        this.ground = this.add.tileSprite(0, this.gameHeight, 88, 26, 'ground').setOrigin(0, 1);
    }

    createPlayer(){
        this.player = new Player(this, 0, this.gameHeight);
    }

    // update(){
    //    if (this.shouldStartRoll) this.ground.width += 4
    // }
}

export default PlayScene;