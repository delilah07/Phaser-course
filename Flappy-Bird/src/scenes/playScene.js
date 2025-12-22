import BaseScene from "./baseScene"

const PIPES_TO_RENDER =  4

class PlayScene extends BaseScene{
    constructor(config){
        super('PlayScene', {...config, canGoBack:false})
    
        this.bird = null
        
        this.pipe = null
        this.pipeHorizontalDistance = 0;
        this.pipeVerticalDistanceRange = [150, 250]
        this.pipeHorizontalDistanceRange = [400,600]
        this.flapVelocity = 200

        this.score = 0
        this.scoreText = ''
        this.bestScore = localStorage.getItem('bestScore') || 0
        this.bestScoreText = ''

        this.isPaused = false

        this.currentDifficulty = 'easy';
        this.difficulty = {
            'easy': {
                pipeVerticalDistanceRange: [150, 250],
                pipeHorizontalDistanceRange: [400, 600]
            },
            'hardEasy': {
                pipeVerticalDistanceRange: [140, 230],
                pipeHorizontalDistanceRange: [360, 530]
            },
            'normal': {
                pipeVerticalDistanceRange: [130, 210],
                pipeHorizontalDistanceRange: [320, 455]
            },
            'hardNormal': {
                pipeVerticalDistanceRange: [120, 190],
                pipeHorizontalDistanceRange: [280, 380]
            },
            'hard': {
                pipeVerticalDistanceRange: [110, 170],
                pipeHorizontalDistanceRange: [240, 310]
            },
        }
        this.difficultyScoreLevel = 5
    }

    create(){
        this.currentDifficulty = 'easy'
        this.score = 0
        super.create()
        this.createBird();
        this.createPipes();
        this.createColliders();
        this.createPause();
        this.handleInputs();

        this.createScore()
        this.listenEvents()
    }
    update() {
        this.checkGameStatus();
        this.recyclePipe();
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

        this.pipes.setVelocityX(-150)
    }
    listenEvents(){
        if(this.pauseEvent) {return}
        this.pauseEvent = this.events.on('resume', () =>{
            let initialTime = 3
            this.countDownText = this.add.text(...this.screenCenter, `Fly in: ${initialTime}`, this.fontOption).setOrigin(0.5, 1);
            this.timedEvent = this.time.addEvent({
                delay: 1000,
                callback: () => {
                    initialTime--;
                    this.countDownText.setText(`Fly in: ${initialTime}`)
                    if(initialTime === 0){
                        this.countDownText.setText('')
                        this.physics.resume()
                        this.timedEvent.remove()
                        this.isPaused = false
                    }
                },
                callbackScope: this,
                loop: true
            })
        })
    }
    createPause() {
        const pauseBtn = this.add.image(this.config.width - 20, this.config.height- 20, 'pause')
            .setOrigin(1, 1)
            .setScale(2)
            .setInteractive();

        pauseBtn.on('pointerdown', () => {
            this.isPaused = true
            this.physics.pause();
            this.scene.pause()
            this.scene.launch('PauseScene')
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
        if (this.isPaused) return
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
        console.log(this.score, this.currentDifficulty)
        const difficulty = this.difficulty[this.currentDifficulty]
        const rightMostX = this.getRightMostPipe()
        const pipeVerticalDistance = Phaser.Math.Between(...difficulty.pipeVerticalDistanceRange)
        const pipeVerticalPosition = Phaser.Math.Between(20, this.config.height - 20 - pipeVerticalDistance)

        const pipeHorizontalDistance = Phaser.Math.Between(...difficulty.pipeHorizontalDistanceRange)

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
                    this.increaseDifficulty()
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

    increaseDifficulty(){
        const keysArray = Object.keys(this.difficulty)
        this.currentDifficulty = this.score < this.difficultyScoreLevel * keysArray.length 
            ? keysArray[Math.trunc(this.score / this.difficultyScoreLevel)] : 
            keysArray[keysArray.length - 1]
    }
}

export default PlayScene