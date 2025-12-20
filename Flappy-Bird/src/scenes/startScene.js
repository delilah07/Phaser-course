import BaseScene from "./baseScene";

class StartScene extends BaseScene{
    constructor(config){
        super("StartScene", {...config, canGoBack:false});
    }

    create(){
        super.create()

       const gameName = this.add
            .text(this.config.width/2, this.config.height/2 - 20, 'Flappy Bird', this.fontOption)
            .setOrigin(0.5, 1);

            gameName.setFontSize(54)

        const startBtn = this.add
            .text(this.config.width/2, this.config.height/2 + 40, 'Start', this.fontOption)
            .setOrigin(0.5, 1).setInteractive();

        startBtn.on('pointerover', ()=> {
            startBtn.setStyle({fill: '#2400c7'})
        })
        startBtn.on('pointerout', ()=> {
            startBtn.setStyle({fill: '#0073ff'})
        })
        startBtn.on('pointerdown', ()=> this.scene.start('MenuScene'))
    }

    
}

export default StartScene