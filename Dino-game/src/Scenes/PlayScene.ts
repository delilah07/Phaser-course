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

    gameSpeed: number = 8;

    gameOverContaine: Phaser.GameObjects.Container
    gameOverText: Phaser.GameObjects.Image
    restartText: Phaser.GameObjects.Image

    constructor(){
        super('PlayScene');
    }

    create(){   
        this.createEnviroment();
        this.createPlayer();
        this.createObstacles();
        this.createGameOverContainer();

        this.handleGameStart();
        this.handleObstacleCoallisions();
        this.handleGameRestart();

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
        const obctacle =  this.obstaclesArr.create(distance, this.gameHeight, `obstacle-${obstacleNum}-img`).setOrigin(0, 1);
        obctacle.setImmovable()
    }

    createObstacles(){
        this.obstaclesArr = this.physics.add.group();
        
    };

    createGameOverContainer(){
        
        this.gameOverText = this.add.image(0, 0, 'game-over-image')
        this.restartText = this.add.image(0, 60, 'restart-image').setInteractive();

        this.gameOverContaine = this.add
            .container(this.gameWidth / 2, this.gameHeight / 2 - 60)
            .add([this.gameOverText, this.restartText])
            .setAlpha(0);

       
    };

    handleGameStart(){
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
            });
        });
    };

    handleObstacleCoallisions(){
        this.physics.add.collider(this.obstaclesArr, this.player, () => {
            this.isGameRunning = false;
            this.physics.pause();
            this.player.die();

            this.gameOverContaine.setAlpha(1)
        });
    };

    handleGameRestart(){
        this.restartText.on('pointerdown', ()=> {
            this.physics.resume();
            this.player.setVelocityY(0);
            this.obstaclesArr.clear(true, true);
            this.gameOverContaine.setAlpha(0);
            this.anims.resumeAll();

            this.isGameRunning = true;

        })
    };

}

export default PlayScene;