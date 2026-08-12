export default {
  addCollider(otherGameObj, callback) {
    this.scene.physics.add.collider(this, otherGameObj, callback, null, this);
    return this;
  },
};
