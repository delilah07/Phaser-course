import Phaser from 'phaser';

class Play extends Phaser.Scene {
    constructor() {
        super('PlayScene')
    }

    create(){
        const map = this.createMap();
        const layers = this.createLayers(map);

        const player = this.createPlayer();

        this.physics.add.collider(player, layers.platformsColliders);
    }

    createMap(){
        const map = this.make.tilemap({key: 'map'});
        map.addTilesetImage('main_lev_build_1', 'tiles-1');
        map.addTilesetImage('main_lev_build_2', 'tiles-2');
        return map;
    }

    createLayers(map){
        const tileset1 = map.getTileset('main_lev_build_1');
        const tileset2 = map.getTileset('main_lev_build_2');
        const platformsColliders = map.createDynamicLayer('platforms_colliders', tileset1);
        const environment = map.createStaticLayer('environment', [tileset1, tileset2]);
        const platforms = map.createDynamicLayer('platforms', tileset1);
       
        platformsColliders.setCollisionByProperty({collides: true});
        
        return {environment, platforms, platformsColliders}
    }

    createPlayer(){
        const player = this.physics.add.sprite(100, 250, 'player');
        player.body.setGravityY(500);
        player.setCollideWorldBounds(true);

        return player;
    }
    
}

export default Play;