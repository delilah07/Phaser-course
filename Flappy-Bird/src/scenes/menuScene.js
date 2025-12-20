import BaseScene from "./baseScene";

class MenuScene extends BaseScene{
    constructor(config){
        super("MenuScene", config);
    }

    create(){
        super.create()
        this.scene.start('PlayScene');
    }
}

export default MenuScene