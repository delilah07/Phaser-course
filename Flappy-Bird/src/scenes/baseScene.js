import Phaser from "phaser";

class BaseScene extends Phaser.Scene{
    constructor(key, config){
        super(key)
        this.config = config
        this.screenCenter = [config.width/1.25, config.height/1.1]
    }

    create(){
        this.add.image(0, 0, 'sky').setOrigin(0, 0);
    }

    createMenu(menu, setupMenuEvents){
        let lastMenuPosition = 0
        menu.forEach(menuItem => {
            const menuPosition = [this.screenCenter[0], this.screenCenter[1] + lastMenuPosition];
            menuItem.textObject = this.add
                .text(...menuPosition, menuItem.text, {fontSize: '32px', fill: '#0073ff', fontStyle: 'bold', strokeThickness: '5' })
                .setOrigin(0.5, 1);
            lastMenuPosition += 42
            setupMenuEvents(menuItem)
        });
    }
}

export default BaseScene;