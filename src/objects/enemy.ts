import { Bullet } from './bullet';
import { IImageConstructor } from '../interfaces/image.interface';
import { AudioSources } from './Audio';

export class Enemy extends Phaser.GameObjects.Image {
  body: Phaser.Physics.Arcade.Body;

  // variables
  private health: number;
  private lastShoot: number;
  private speed: number;

  // children
  private barrel: Phaser.GameObjects.Image;
  private lifeBar: Phaser.GameObjects.Graphics;

  // game objects
  private bullets: Phaser.GameObjects.Group;

  private audio: AudioSources;

  public getBarrel(): Phaser.GameObjects.Image {
    return this.barrel;
  }

  public getBullets(): Phaser.GameObjects.Group {
    return this.bullets;
  }

  constructor(aParams: IImageConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);

    this.initContainer();
    this.scene.add.existing(this);
    this.audio = new AudioSources(this.scene);
  }

  private initContainer() {
    // variables
    this.health = 1;
    this.lastShoot = 0;
    this.speed = 100;

    // image
    this.setDepth(0);

    this.barrel = this.scene.add.image(0, 0, 'barrelRed');
    this.barrel.setOrigin(0.5, 1);
    this.barrel.setDepth(1);

    this.lifeBar = this.scene.add.graphics();
    this.redrawLifebar();

    // game objects
    this.bullets = this.scene.add.group({
      /*classType: Bullet,*/
      active: true,
      maxSize: 10,
      runChildUpdate: true
    });

    // tweens
    this.scene.tweens.add({
      targets: this,
      props: { y: this.y - 200 },
      delay: 0,
      duration: 2000,
      ease: 'Linear',
      easeParams: null,
      hold: 0,
      repeat: -1,
      repeatDelay: 0,
      yoyo: true
    });

    // physics
    this.scene.physics.world.enable(this);
  }

  update(): void {
    if (this.active) {
      this.barrel.x = this.x;
      this.barrel.y = this.y;
      this.lifeBar.x = this.x;
      this.lifeBar.y = this.y;
      this.handleShooting();
    } else {
      this.destroy();
      this.barrel.destroy();
      this.lifeBar.destroy();
    }
  }

  private handleShooting(): void {
    if (this.scene.time.now > (this.lastShoot + 500)) {
      if (this.bullets.getLength() < 10) {
        this.bullets.add(
          new Bullet({
            scene: this.scene,
            rotation: this.barrel.rotation,
            x: this.barrel.x,
            y: this.barrel.y,
            texture: 'bulletRed'
          })
        );

        this.lastShoot = this.scene.time.now + 900;
      }
    }
  }

  private redrawLifebar(): void {
    this.lifeBar.clear();
    this.lifeBar.fillStyle(0xe66a28, 1);
    this.lifeBar.fillRect(
      -this.width / 2,
      this.height / 2,
      this.width * this.health,
      15
    );
    this.lifeBar.lineStyle(2, 0xffffff);
    this.lifeBar.strokeRect(-this.width / 2, this.height / 2, this.width, 15);
    this.lifeBar.setDepth(1);
  }

  public updateHealth(): void {
    if (this.health > 0) {
      this.health -= 0.05;
      this.redrawLifebar();
    } else {
      this.health = 0;
      this.active = false;
      var b = this.scene.add.sprite(this.x, this.y, 'boom', 23);
      b.displayHeight = 120;
      b.displayWidth = 120;
      let i =0;
      for(; i < 3; i++)
      {
      b.x +=20;
      b.y -=20;
      b.play("explode");
      }
      this.audio.audioExplode.play();
    }
  }
}
