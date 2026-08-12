import Phaser from 'phaser';
import Player from '../entities/Player';

import Enemies from '../groups/Enemies';

class Play extends Phaser.Scene {
  constructor(config) {
    super('PlayScene');
    this.config = config;
  }

  create() {
    const map = this.createMap();
    const layers = this.createLayers(map);
    const playerZones = this.getPlayerZones(layers.playerZones);

    const player = this.createPlayer(playerZones.start);

    this.createPlayerColliders(player, {
      colliders: {
        platformsColliders: layers.platformsColliders,
      },
    });

    const enemies = this.createEnemies(layers.enemySpawns);

    this.createEnemyColliders(enemies, {
      colliders: {
        platformsColliders: layers.platformsColliders,
        player,
      },
    });

    this.createEndOfLevel(playerZones.end, player);

    this.setupFollowupCameraOn(player);
  }

  createMap() {
    const map = this.make.tilemap({ key: 'map' });
    map.addTilesetImage('main_lev_build_1', 'tiles-1');
    map.addTilesetImage('main_lev_build_2', 'tiles-2');
    return map;
  }

  createLayers(map) {
    const tileset1 = map.getTileset('main_lev_build_1');
    const tileset2 = map.getTileset('main_lev_build_2');
    const platformsColliders = map.createDynamicLayer(
      'platforms_colliders',
      tileset1,
    );
    const environment = map.createStaticLayer('environment', [
      tileset1,
      tileset2,
    ]);
    const platforms = map.createDynamicLayer('platforms', tileset1);

    const playerZones = map.getObjectLayer('player_zones');

    const enemySpawns = map.getObjectLayer('enemy_spawns');

    platformsColliders.setCollisionByProperty({ collides: true });

    return {
      environment,
      platforms,
      platformsColliders,
      playerZones,
      enemySpawns,
    };
  }

  createPlayer(start) {
    return new Player(this, start.x, start.y);
  }

  createPlayerColliders(player, { colliders }) {
    player.addCollider(colliders.platformsColliders);
  }

  createEnemies(spawnLayer) {
    const enemies = new Enemies(this);
    const enemyTypes = enemies.getTypes();

    spawnLayer.objects.forEach((spawnPoint) => {
      const enemy = new enemyTypes[spawnPoint.type](
        this,
        spawnPoint.x,
        spawnPoint.y,
      );
      enemies.add(enemy);
    });

    return enemies;
  }

  createEnemyColliders(enemies, { colliders }) {
    enemies
      .addCollider(colliders.platformsColliders)
      .addCollider(colliders.player);
  }

  setupFollowupCameraOn(player) {
    const { height, width, mapOffset, zoomFactor } = this.config;
    this.physics.world.setBounds(0, 0, width + mapOffset, height + 200);
    this.cameras.main
      .setBounds(0, 0, width + mapOffset, height)
      .setZoom(zoomFactor);
    this.cameras.main.startFollow(player);
  }

  getPlayerZones(playerZonesLayer) {
    const playerZones = playerZonesLayer.objects;
    return {
      start: playerZones[0],
      end: playerZones[1],
    };
  }

  createEndOfLevel(end, player) {
    const endOfLevel = this.physics.add
      .sprite(end.x, end.y, 'end')
      .setSize(5, this.config.endSize)
      .setAlpha(0.0)
      .setOrigin(0.5, 1);

    const endOfLevelOverlap = this.physics.add.overlap(
      player,
      endOfLevel,
      () => {
        endOfLevelOverlap.active = false;
        console.log('New level');
      },
    );
  }
}

export default Play;
