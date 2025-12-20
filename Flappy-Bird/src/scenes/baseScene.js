import Phaser from "phaser";

class BaseScene extends Phaser.Scene{
    constructor(key, config){
        super(key)
        this.config = config
        this.screenCenter = [config.width/2, config.height/2]
        this.fontOption = {fontSize: '32px', color: '#0073ff', fontStyle: 'bold', stroke: '#fff', strokeThickness: 5 }
    }

    create(){
        this.add.image(0, 0, 'sky').setOrigin(0, 0);

        if(this.config.canGoBack){
              const backBtn = this.add.image(this.config.width - 20, this.config.height- 20, 'back')
                    .setOrigin(1, 1)
                    .setScale(1.5)
                    .setInteractive();

                backBtn.on('pointerup', () => {
                    this.scene.start('MenuScene')
                })
        }
    }

    createMenu(menu, setupMenuEvents){
        let lastMenuPosition = -20
        menu.forEach(menuItem => {
            const menuPosition = [this.screenCenter[0], this.screenCenter[1] + lastMenuPosition];
            console.log(menuItem.text, menuItem, menuPosition)
            menuItem.textObject = this.add
                .text(...menuPosition, menuItem.text, this.fontOption)
                .setOrigin(0.5, 1);
            lastMenuPosition += 42
            setupMenuEvents(menuItem)
        });
    }
}

export default BaseScene;