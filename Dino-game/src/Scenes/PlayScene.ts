import Phaser from "phaser";
import { Player } from '../entities/Player';
import { GameScene } from './GameScene'
import { PRELOAD_CONFIG } from "..";

class PlayScene extends GameScene{
    player: Player;
    startTrigger: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    ground: Phaser.GameObjects.TileSprite;

    spawnInterwal: number = 1500;
    spawnTime: number = 0;
    obstaclesArr: Phaser.Physics.Arcade.Group;
    gameSpeed: number = 7;

    constructor(){
        super('PlayScene');
    }

    create(){   
        this.createEnviroment();
        this.createPlayer();

        this.obstaclesArr = this.physics.add.group();

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

    update(time: number, delta: number){
        if(!this.isGameRunning) return;


        this.spawnTime += delta;

        if (this.spawnTime >= this.spawnInterwal){
            this.spawnObstacles();
            this.spawnTime = 0;
        }

        Phaser.Actions.IncX(this.obstaclesArr.getChildren(), -this.gameSpeed);

        this.obstaclesArr.getChildren().forEach((obstacle: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) => {
            if (obstacle.getBounds().right < 0) this.obstaclesArr.remove(obstacle)
        });

        this.ground.tilePositionX += this.gameSpeed;
    }

    createEnviroment(){
        this.ground = this.add.tileSprite(0, this.gameHeight, 88, 26, 'ground').setOrigin(0, 1);
    }

    createPlayer(){
        this.player = new Player(this, 0, this.gameHeight);
    }

    spawnObstacles(){
        const obstacleNum = Math.ceil(Math.random() * PRELOAD_CONFIG.cactusesCount);
        const distance = Phaser.Math.Between(600, 900);
        this.obstaclesArr.create(distance, this.gameHeight, `obstacle-${obstacleNum}-img`).setOrigin(0, 1);
    }

}

export default PlayScene;