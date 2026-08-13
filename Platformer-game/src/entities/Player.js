import Phaser from 'phaser';
import initAnimation from './anims/PlayerAnims';

import collidable from '../mixins/collidable';

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Mixins
    Object.assign(this, collidable);

    this.init();
    this.initEvents();
  }

  init() {
    this.gravity = 400;
    this.playerSpeed = 140;
    this.jumpCount = 0;
    this.maxJumps = 1;
    this.hasBeenHit = false;
    this.bounceVelocity = 250;
    this.cursors = this.scene.input.keyboard.createCursorKeys();

    this.body.setSize(this.width - 14, this.height - 5);
    this.setOffset(7, 5);
    this.body.setGravityY(this.gravity);
    this.setCollideWorldBounds(true);
    this.setOrigin(0.5, 1);

    initAnimation(this.scene.anims);
  }

  initEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
  }

  update() {
    if (this.hasBeenHit) return;
    const { left, right, space, up } = this.cursors;
    const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space);
    const isUpJustDown = Phaser.Input.Keyboard.JustDown(up);
    const onFloor = this.body.onFloor();

    if (left.isDown) {
      this.setVelocityX(-this.playerSpeed);
      this.setFlipX(true);
    } else if (right.isDown) {
      this.setVelocityX(this.playerSpeed);
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }

    if (
      (isSpaceJustDown || isUpJustDown) &&
      (onFloor || this.jumpCount <= this.maxJumps)
    ) {
      this.setVelocityY(-this.playerSpeed * 2);
      this.jumpCount++;
    }

    if (onFloor) this.jumpCount = 0;

    onFloor
      ? this.body.velocity.x !== 0
        ? this.play('run', true)
        : this.play('idle', true)
      : this.play('jump', true);
  }

  playDamageTween() {
    return this.scene.tweens.add({
      targets: this,
      duration: 100,
      repeat: -1,
      tint: 0xffffff,
    });
  }

  takeHit(initiator) {
    if (this.hasBeenHit) return;
    this.hasBeenHit = true;
    this.bounceOff();
    const hitAnim = this.playDamageTween();

    // this.scene.time.addEvent({
    //   delay: 1000,
    //   callback: () => (this.hasBeenHit = false),
    //   loop: false,
    // });
    this.scene.time.delayedCall(1000, () => {
      this.hasBeenHit = false;
      hitAnim.stop();
      this.clearTint();
    });
  }

  bounceOff() {
    this.body.touching.right
      ? this.setVelocityX(-this.bounceVelocity)
      : this.setVelocityX(this.bounceVelocity);

    setTimeout(() => this.setVelocityY(-this.bounceVelocity), 0);
  }
}

export default Player;
