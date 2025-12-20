import BaseScene from "./baseScene";

class MenuScene extends BaseScene{
    constructor(config){
        super("MenuScene", {...config, canGoBack:false});
        this.menu = [
            {scene: 'PlayScene', text: 'Play'},
            {scene: 'ScoreScene', text: 'Score'},
            {scene: 'StartScene', text: 'Exit'},
        ]
    }

    create(){
        super.create()
        this.createMenu(this.menu, this.setupMenuIvents.bind(this))
    }

    setupMenuIvents(menuItem){
        const textObject = menuItem.textObject
        textObject.setInteractive()

        textObject.on('pointerover', ()=> {
            textObject.setStyle({fill: '#2400c7'})
        })
        textObject.on('pointerout', ()=> {
            textObject.setStyle({fill: '#0073ff'})
        })
        textObject.on('pointerup', ()=> menuItem.scene && this.scene.start(menuItem.scene))
    }
}

export default MenuScene