import Phaser from "phaser";
import { Player } from '../entities/Player';
import { GameScene } from './GameScene'
import { PRELOAD_CONFIG } from "..";

class PlayScene extends GameScene{
    player: Player;
    startTrigger: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    ground: Phaser.GameObjects.TileSprite;
    clouds: Phaser.GameObjects.Group;

    spawnInterwal: number = 1500;
    spawnTime: number = 0;
    obstaclesArr: Phaser.Physics.Arcade.Group;

    gameSpeed: number = 8;

    gameOverContaine: Phaser.GameObjects.Container;
    gameOverText: Phaser.GameObjects.Image;
    restartText: Phaser.GameObjects.Image;

    scoreText: Phaser.GameObjects.Text;
    score: number = 0;
    scoreInterval: number = 100;
    scoreDeltaTime: number = 0;

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

        this.createAnimations();

        this.createScore();

    }

    update(time: number, delta: number){
        if(!this.isGameRunning) return;

        this.spawnTime += delta;
        this.scoreDeltaTime += delta

        if (this.spawnTime >= this.spawnInterwal){
            this.spawnObstacles();
            this.spawnTime = 0;
        }
        if (this.scoreDeltaTime >= this.scoreInterval) {
            this.score++;
            this.scoreDeltaTime = 0;
        }

        Phaser.Actions.IncX(this.obstaclesArr.getChildren(), -this.gameSpeed);
        Phaser.Actions.IncX(this.clouds.getChildren(), -0.5);

        const score = Array.from(String(this.score), Number);
        for (let i = 0; i < 5 - String(this.score).length; i++) {
            score.unshift(0)
        }
        this.scoreText.setText(score.join(''));

        this.obstaclesArr.getChildren().forEach((obstacle: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) => {
            if (obstacle.getBounds().right < 0) this.obstaclesArr.remove(obstacle)
        });

        this.clouds.getChildren().forEach((cloud: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) => {
             if (cloud.getBounds().right < 0) cloud.x = this.gameWidth + 30;
        })

        this.ground.tilePositionX += this.gameSpeed;
    }

    createEnviroment(){
        this.ground = this.add.tileSprite(0, this.gameHeight, 88, 26, 'ground').setOrigin(0, 1);

        this.clouds = this.add.group();
        this.clouds = this.clouds.addMultiple([
            this.add.image(this.gameWidth / 2, 170, 'cloud'),
            this.add.image(this.gameWidth - 80, 80, 'cloud'),
            this.add.image(this.gameWidth / 1.3, 100, 'cloud'),
        ]);
        this.clouds.setAlpha(0);
    }

    createPlayer(){
        this.player = new Player(this, 0, this.gameHeight);
    }

    spawnObstacles(){
        const obstaclesCount = PRELOAD_CONFIG.cactusesCount + PRELOAD_CONFIG.birdsCount
        const obstacleNum = Math.ceil(Math.random() * obstaclesCount);
        const distance = Phaser.Math.Between(150, 300);

        if(obstacleNum <= 6){
            const obctacle = this.obstaclesArr.create(this.gameWidth + distance, this.gameHeight, `obstacle-${obstacleNum}-img`).setOrigin(0, 1);
            obctacle.setImmovable()
        } else {
            const enemyPossibleHeight = [20, 70];
            const enemyHeight = enemyPossibleHeight[Math.floor(Math.random() * enemyPossibleHeight.length)]
            const obstacle = this.obstaclesArr.create(this.gameWidth + distance, this.gameHeight - enemyHeight, `enemy-bird-sprite`).setOrigin(0, 1).setImmovable();
            obstacle.play('enemy-bird-anim', true)
        }
    }

    createAnimations(){
        this.anims.create({
            key: 'enemy-bird-anim',
            frames: this.anims.generateFrameNumbers('enemy-bird-sprite'),
            frameRate: 6,
            repeat: -1
        })
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
                        this.clouds.setAlpha(1);
                        this.isGameRunning = true;
                        this.scoreText.setAlpha(1)
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

            this.anims.pauseAll()

            this.gameOverContaine.setAlpha(1);

            this.spawnTime = 0;
            this.gameSpeed = 5;

            // this.score = 0;
            this.scoreDeltaTime = 0;
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

    createScore(){
        this.scoreText = this.add.text(this.gameWidth, 0, '00000', {
            fontSize: 30,
            fontFamily: 'Ariel',
            color: '#535353',
            fontStyle: 'bold',
            resolution: 10
        }).setOrigin(1, 0)
            .setAlpha(0);
    }
}

export default PlayScene;