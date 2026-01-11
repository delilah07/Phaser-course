export class Player extends Phaser.Physics.Arcade.Sprite{
    constructor(scene: Phaser.Scene, x: number, y: number){
        super(scene, x, y, 'dino-idle');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.init();

        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)

        this.registerAnimation()
    }

    cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    init(){
        this.cursors = this.scene.input.keyboard.createCursorKeys()
        this
            .setOrigin(0, 1)
            .setGravityY(5000)
            .setCollideWorldBounds(true)
            .setBodySize(44, 92);
    }

    update(){
        const { space } = this.cursors;
       
        const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space);

        const onFloor = (this.body as Phaser.Physics.Arcade.Body).onFloor();

        if (isSpaceJustDown && onFloor) this.setVelocityY(-1600);

        if ((this.scene as any).isGameRunning === false){
            return
        }

        if (this.body.deltaAbsY() > 0) {
            this.anims.stop();
            this.setTexture('dino-run-sprite', 0);
        } else {
            this.playRunAnim()
        }
    }

    registerAnimation(){
        this.anims.create({
            key: 'dino-run-anim',
            frames: this.anims.generateFrameNumbers('dino-run-sprite', {
                start: 2,
                end: 3
            }),
            frameRate: 10,
            repeat: -1
        });
    }

    playRunAnim(){
        this.play('dino-run-anim', true);
    }
}