import { Player } from '../objects/player';
import { Enemy } from '../objects/enemy';
import { Obstacle } from '../objects/obstacles/obstacle';
import { Bullet } from '../objects/bullet';
import { AudioSources } from '../objects/Audio';

export class GameScene extends Phaser.Scene {
  private map: Phaser.Tilemaps.Tilemap;
  private tileset: Phaser.Tilemaps.Tileset;
  private layer: Phaser.Tilemaps.TilemapLayer;

  private player: Player;
  private enemies: Phaser.GameObjects.Group;
  private obstacles: Phaser.GameObjects.Group;

  private target: Phaser.Math.Vector2;
  private emitter: Phaser.GameObjects.Particles.ParticleEmitter;

  private audio: AudioSources;
  


  constructor() {
    super({
      key: 'GameScene'
    });
  }

  init(): void {}

  create(): void {
    
    // create tilemap from tiled JSON
    this.map = this.make.tilemap({ key: 'levelMap' });

    this.tileset = this.map.addTilesetImage('tiles');
    this.layer = this.map.createLayer('tileLayer', this.tileset, 0, 0);
    this.layer.setCollisionByProperty({ collide: true });
    const config = {
      key: 'explode',
      frames: 'boom',
      frameRate: 50,
      repeat: 0,
      // repeatDelay: 1500
   };

   this.anims.create(config);
   var particles = this.add.particles('flares');
   this.emitter = particles.createEmitter({
    frame : ['blue','green','white', 'red'],
    x: -400,
    y: -300,
    speed: { min: -800, max: 800 },
    angle: { min: 0, max: 360 },
    scale: { start: 0.5, end: 0 },
    blendMode: 'SCREEN',
    //active: false,
    lifespan: 600,
    gravityY: 800
    });

    this.audio = new AudioSources(this);

    this.obstacles = this.add.group({
      /*classType: Obstacle,*/
      runChildUpdate: true
    });

    this.enemies = this.add.group({
      /*classType: Enemy*/
    });
    this.convertObjects();

    // collider layer and obstacles
    this.physics.add.collider(this.player, this.layer);
    this.physics.add.collider(this.player, this.obstacles);

    // collider for bullets
    
    this.physics.add.collider(
      this.player.getBullets(),
      this.layer,
      this.bulletHitLayer, 
      null,
      this
    );
      // this.aaa();
    this.physics.add.collider(
      this.player.getBullets(),
      this.obstacles,
      this.bulletHitObstacles,
      null,
      this
    );
    

    this.enemies.children.each((enemy: Enemy) => {
      this.physics.add.overlap(
        this.player.getBullets(),
        enemy,
        this.playerBulletHitEnemy,
        null,
        this
      );
      this.physics.add.overlap(
        enemy.getBullets(),
        this.player,
        this.enemyBulletHitPlayer,
        null,
        this
      );

      this.physics.add.collider(
        enemy.getBullets(),
        this.obstacles,
        this.bulletHitObstacles,
        null,
        this
      );
      this.physics.add.collider(
        enemy.getBullets(),
        this.layer,
        this.bulletHitLayer,
        null,
        this
      );
      this.physics.add.collider(
        this.player.getBullets(),
        enemy.getBullets(),
        this.bulletHit,
        null,
        this
      );
    }, this);

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
    // this.cameras.main.setZoom(2);
  }

  update(): void {
    this.player.update();
    this.enemies.children.each((enemy: Enemy) => {
      enemy.update();
      if (this.player.active && enemy.active) {
        var angle = Phaser.Math.Angle.Between(
          enemy.body.x,
          enemy.body.y,
          this.player.body.x,
          this.player.body.y
        );

        enemy.getBarrel().angle =
          (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
      }
    }, this);
    
  }

  private convertObjects(): void {
    // find the object layer in the tilemap named 'objects'
  
    
    const objects = this.map.getObjectLayer('objects').objects as any[];

    objects.forEach((object) => {
      if (object.type === 'player') {
        this.player = new Player({
          scene: this,
          x: object.x,
          y: object.y,
          texture: 'tankBlue'
        });
      } else if (object.type === 'enemy') {
        let enemy = new Enemy({
          scene: this,
          x: object.x,
          y: object.y,
          texture: 'tankRed'
        });

        this.enemies.add(enemy);
      } else {
        let obstacle = new Obstacle({
          scene: this,
          x: object.x,
          y: object.y - 40,
          texture: object.type
        });

        this.obstacles.add(obstacle);
      }
    });
  }

  private bulletHit(b1 : Bullet,  b2 : Bullet): void {
    this.emitter.explode(3,b1.x,b1.y);
    b1.destroy();
    b2.destroy();
  }
  
  private bulletHitLayer(bullet: Bullet): void {
    // console.log(this.boom);
    var b = this.add.sprite(bullet.x, bullet.y, 'boom', 23);
    b.play("explode");
    if(this.registry.get("audio") == 1)
    {
    this.audio.audioHit.play();
    }
    bullet.destroy();
  }

  private bulletHitObstacles(bullet: Bullet, obstacle: Obstacle): void {
    this.emitter.explode(3,bullet.x,bullet.y);
    bullet.destroy();
  }

  private enemyBulletHitPlayer(bullet: Bullet, player: Player): void {
    this.emitter.explode(3,bullet.x,bullet.y);
    bullet.destroy();
    player.updateHealth();
  }

  private playerBulletHitEnemy(bullet: Bullet, enemy: Enemy): void {
    this.emitter.explode(3,bullet.x,bullet.y);
    bullet.destroy();
    enemy.updateHealth();
  }
}
