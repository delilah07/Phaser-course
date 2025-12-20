import BaseScene from "./baseScene";

class ScoreScene extends BaseScene{
    constructor(config){
        super("ScoreScene", {...config, canGoBack:true});
    }

    create(){
        super.create()

        const bestScore = localStorage.getItem('bestScore');
        this.add
            .text(this.config.width/2, this.config.height/2, `Your Best Score: ${bestScore || 0}`, {fontSize: '32px', color: '#0073ff', fontStyle: 'bold', strokeThickness: '5' })
            .setOrigin(0.035, 0.05);
    }

    
}

export default ScoreScene