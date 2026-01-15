import { GameScene } from "../scenes/GameScene";

export class Player extends Phaser.Physics.Arcade.Sprite{
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    scene: GameScene;

    jumpSound: Phaser.Sound.HTML5AudioSound;
    hitSound: Phaser.Sound.HTML5AudioSound;

    constructor(scene: GameScene, x: number, y: number){
        super(scene, x, y, 'dino-run-sprite');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.init();

        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)

        this.registerAnimation()
    }

    init(){
        this.cursors = this.scene.input.keyboard.createCursorKeys()
        this
            .setOrigin(0, 1)
            .setGravityY(5000)
            .setCollideWorldBounds(true)
            .setBodySize(44, 92)
            .setOffset(20, 0)
            .setDepth(1);

        this.registerAnimation();
        this.registerSounds();

        
    }

    update(){
        const { space, down } = this.cursors;
       
        const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space);
        const isDownJustDown = Phaser.Input.Keyboard.JustDown(down);
        const isDownJustUp = Phaser.Input.Keyboard.JustUp(down);

        const onFloor = (this.body as Phaser.Physics.Arcade.Body).onFloor();

        if (isSpaceJustDown && onFloor) {
            this.setVelocityY(-1600);
            this.jumpSound.play();
        }
        
        if (isDownJustDown && onFloor) {
            this.body.setSize(this.body.width, 58);
            this.setOffset(60, 34);
        };
        if (isDownJustUp && onFloor) {
            this.body.setSize(44, 92);
            this.setOffset(20, 0);
        };

        if (this.scene.isGameRunning === false){
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
        this.anims.create({
            key: 'dino-down-anim',
            frames: this.anims.generateFrameNumbers('dino-down-sprite'),
            frameRate: 10,
            repeat: -1
        });
    }

    playRunAnim(){
        this.body.height > 58 
            ? this.play('dino-run-anim', true) 
            : this.play('dino-down-anim', true);
    }

    die(){
        this.anims.pause();
        this.setTexture('dino-hurt-image');
        this.hitSound.play();
    }

    registerSounds(){
        this.jumpSound = this.scene.sound.add('jump-sound', {volume: 1}) as Phaser.Sound.HTML5AudioSound;
        this.hitSound = this.scene.sound.add('hit-sound', {volume: 1}) as Phaser.Sound.HTML5AudioSound;
    }
}