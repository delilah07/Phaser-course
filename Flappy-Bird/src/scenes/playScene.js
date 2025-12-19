import Phaser from "phaser"

const PIPES_TO_RENDER =  4

class PlayScene extends Phaser.Scene{
    constructor(config){
        super('PlayScene')

        this.config = config
    
        this.bird = null
        
        this.pipe = null
        this.pipeHorizontalDistance = 0;
        this.pipeVerticalDistanceRange = [150, 250]
        this.pipeHorizontalDistanceRange = [400,600]
        this.flapVelocity = 150

        this.score = 0
        this.scoreText = ''
        this.bestScore = localStorage.getItem('bestScore') || 0
        this.bestScoreText = ''
    }

    create(){
        this.createBG();
        this.createBird();
        this.createPipes();
        this.createColliders();
        this.createPause();
        this.handleInputs();

        this.createScore()
    }
    update() {
        this.checkGameStatus();
        this.recyclePipe();
    }
    createBG() {
        this.add.image(0, 0, 'sky').setOrigin(0, 0);
    }
    createBird() {
        this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, 'bird');
        this.bird.body.gravity.y = 400;
        this.bird.setCollideWorldBounds(true)
    }
    createPipes() {
        this.pipes = this.physics.add.group();

        for (let i = 0; i < PIPES_TO_RENDER; i++) {
            const upperPipe = this.pipes
                .create(0, 0, 'pipe')
                .setImmovable(true)
                .setOrigin(0, 1);
            const lowerPipe = this.pipes
                .create(0, 0, 'pipe')
                .setImmovable(true)
                .setOrigin(0, 0);

            this.placePipe(upperPipe, lowerPipe)
        }

        this.pipes.setVelocityX(-200)
    }
    createPause() {
        const pauseBtn = this.add.image(this.config.width - 20, this.config.height- 20, 'pause')
            .setOrigin(1, 1)
            .setScale(2)
            .setInteractive();

        pauseBtn.on('pointerdown', () => {
            this.physics.pause();
            this.scene.pause()
        })
    }
    handleInputs() {
        this.input.on('pointerdown', this.flap, this)
        this.input.keyboard.on('keydown-SPACE', this.flap, this)
    }

    checkGameStatus() {
        if (this.bird.y >= this.config.height - this.bird.height / 2 || this.bird.y <= 0 + this.bird.height / 2) {
            this.gameOver()
        } 
    }

    flap(){
        this.bird.body.velocity.y = -this.flapVelocity
    }

    gameOver(){

        this.physics.pause();
        this.bird.setTint(0xff0000)

        const bestScoreValue = localStorage.getItem('bestScore')
        const bestScore = bestScoreValue && parseInt(bestScoreValue, 10)

        if (!bestScore || this.score > bestScore){
            localStorage.setItem('bestScore', this.score)
        }

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.scene.restart()
                this.score = 0
                this.bestScore = localStorage.getItem('bestScore')
            },
            loop: false
        })
    } 

    placePipe(uPipe, lPipe){
        const rightMostX = this.getRightMostPipe()
        const pipeVerticalDistance = Phaser.Math.Between(...this.pipeVerticalDistanceRange)
        const pipeVerticalPosition = Phaser.Math.Between(20, this.config.height - 20 - pipeVerticalDistance)

        const pipeHorizontalDistance = Phaser.Math.Between(...this.pipeHorizontalDistanceRange)

        uPipe.x = rightMostX + pipeHorizontalDistance
        uPipe.y = pipeVerticalPosition
        
        lPipe.x = uPipe.x
        lPipe.y = uPipe.y + pipeVerticalDistance
    }

    recyclePipe(){
        let tempPipes = []
        this.pipes.getChildren().forEach(pipe => {
            if (pipe.getBounds().right <= 0) {
                tempPipes.push(pipe)
                if (tempPipes.length === 2){
                    this.placePipe(...tempPipes);
                    this.increaseScore()
                }
            }
        })
    }

    getRightMostPipe(){
        let rightMostX = 0;

        this.pipes.getChildren().forEach(pipe => rightMostX = Math.max(pipe.x, rightMostX));

        return rightMostX
    }

    createColliders(){
        this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this)
    }

    createScore(){
        this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, {fontSize: '32px', fill: '#000'})

        this.bestScoreText = this.add.text(16, 52, `Best Score: ${this.bestScore}`, {fontSize: '16px', fill: '#000'})
    }

    increaseScore(){
        this.score ++;
        this.scoreText.setText(`Score: ${this.score}`);
    }
    pause(){

    }
}

export default PlayScene