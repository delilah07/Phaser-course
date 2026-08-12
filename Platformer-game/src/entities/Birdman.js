import Enemy from './Enemy';
import initAnims from './anims/BirdmanAnims';

class Birdman extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, 'birdman');

    initAnims(scene.anims);
  }

  shootProjectiles() {
    // Implement shooting logic here
  }

  update(time, delta) {
    super.update(time, delta);
    this.play('birdman-idle', true);
  }
}

export default Birdman;
