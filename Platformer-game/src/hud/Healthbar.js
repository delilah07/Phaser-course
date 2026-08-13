import Phaser from 'phaser';

class Healthbar {
  constructor(scene, x, y, health) {
    this.bar = new Phaser.GameObjects.Graphics(scene);

    this.bar.setScrollFactor(0, 0);

    this.x = x;
    this.y = y;
    this.valueHealth = health;

    this.size = {
      width: 100,
      height: 15,
    };

    this.pixelPerHealth = this.size.width / this.valueHealth;

    scene.add.existing(this.bar);
    this.draw(this.x, this.y);
  }

  decrease(amount) {
    this.valueHealth = amount;
    this.draw(this.x, this.y);
  }

  draw(x, y) {
    this.bar.clear();
    const { width, height } = this.size;

    const margin = 2;

    this.bar.fillStyle(0x9b00ff);
    this.bar.fillRect(x, y, width, height);

    this.bar.fillStyle(0xffffff);
    this.bar.fillRect(
      x + margin,
      y + margin,
      width - 2 * margin,
      height - 2 * margin,
    );

    const healthWidth = this.valueHealth * this.pixelPerHealth;

    healthWidth <= this.size.width / 3
      ? this.bar.fillStyle(0xff0000)
      : this.bar.fillStyle(0x00ff00);

    if (healthWidth > 0) {
      this.bar.fillRect(
        x + margin,
        y + margin,
        healthWidth - 2 * margin,
        height - 2 * margin,
      );
    }
  }
}

export default Healthbar;
