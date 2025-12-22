import BaseScene from "./baseScene";

class ScoreScene extends BaseScene{
    constructor(config){
        super("ScoreScene", {...config, canGoBack:true});
    }

    create(){
        super.create()

        const bestScore = localStorage.getItem('bestScore');

        this.add
            .text(this.config.width/2, this.config.height/2 - 20, 'Your' , this.fontOption)
            .setOrigin(0.5, 1);
        this.add
            .text(this.config.width/2, this.config.height/2 + 22, 'Best Score:', this.fontOption)
           .setOrigin(0.5, 1);
        this.add
            .text(this.config.width/2, this.config.height/2 + 64, `${bestScore || 0}`, this.fontOption)
           .setOrigin(0.5, 1);
   
        
        
   
    }

    
}

export default ScoreScene