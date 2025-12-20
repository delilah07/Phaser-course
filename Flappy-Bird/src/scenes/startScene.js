import BaseScene from "./baseScene";

class StartScene extends BaseScene{
    constructor(config){
        super("StartScene", {...config, canGoBack:false});
    }

    create(){
        super.create()

        this.add
            .text(this.config.width/2, this.config.height/2 - 40, 'Flappy Bird', {fontSize: '52px', fill: '#0073ff', fontStyle: 'bold', strokeThickness: '5' })
            .setOrigin(0.035, 0.05);

        const startBtn = this.add
            .text(this.config.width/2, this.config.height/2 + 20, 'Start', {fontSize: '32px', fill: '#0073ff', fontStyle: 'bold', strokeThickness: '5' })
            .setOrigin(0.1, 0.05).setInteractive();

        startBtn.on('pointerover', ()=> {
            startBtn.setStyle({fill: '#2400c7'})
        })
        startBtn.on('pointerout', ()=> {
            textObject.setStyle({fill: '#0073ff'})
        })
        startBtn.on('pointerup', ()=> this.scene.start('MenuScene'))
    }

    
}

export default StartScene