import BaseScene from './baseScene';

class PauseScene extends BaseScene {

  constructor(config) {
    super('PauseScene', config);

    this.menu = [
      {scene: 'PlayScene', text: 'Continue'},
      {scene: 'MenuScene', text: 'Exit'},
    ]
  }

  create() {
    super.create();
    this.createMenu(this.menu, this.setupMenuEvents.bind(this));
  }

  setupMenuEvents(menuItem) {
    const textObject = menuItem.textObject
        textObject.setInteractive();

    textObject.on('pointerover', () => {
      textObject.setStyle({color: '#2400c7'});
    })

    textObject.on('pointerout', () => {
      textObject.setStyle({color: '#0073ff'});
    })

    textObject.on('pointerup', () => {
    //   textObject.on('pointerdown', ()=> menuItem.scene && this.scene.start(menuItem.scene))
        if (menuItem.scene && menuItem.text === 'Continue'){
            this.scene.stop()
            this.scene.resume(menuItem.scene)
        } else {
            this.scene.stop('PlayScene')
            this.scene.start(menuItem.scene)
           
        }
    })
  }
}

export default PauseScene;