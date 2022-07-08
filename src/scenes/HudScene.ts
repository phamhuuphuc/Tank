export class HudScene extends Phaser.Scene {

    private countText: Phaser.GameObjects.Text;
    private count: number;
    private container1: Phaser.GameObjects.Container;
    private container2: Phaser.GameObjects.Container;
    private container3: Phaser.GameObjects.Container;
    private scoreText: Phaser.GameObjects.Text;
    private highscoreText: Phaser.GameObjects.Text;
    private score: Phaser.GameObjects.Text;
    private pause: boolean = false;

    constructor()
    {
        super('HudScene');
    }
    create()
    {

        var menu  = this.add.graphics();
        menu.fillStyle(0x222222, 0.8);
        menu.fillRect(280, 350, 500, 610);
        var menu1  = this.add.graphics();
        menu1.fillStyle(0x222222, 0.8);
        menu1.fillRect(280, 350, 500, 610);

        var pause = this.add.sprite(1505,60,'button').setScale(0.4);
        pause.setInteractive()
        pause.on('pointerdown', () => 
        {
            if(container.visible != true && this.count <= -1)
            {
            container.setVisible(true);
            this.pause = true;
            this.scene.pause('GameScene');
            }
        });
        var pauseText = this.make.text({
            x : 1500,
            y : 60,
            text : 'Pause',
            style : {
                font: '22px monospace',
            }
        }).setOrigin(0.5,0.5);

        var mute = this.add.sprite(105,60,'button').setScale(0.4);
        mute.setInteractive()
        mute.on('pointerdown', () => 
        {
            if(this.registry.get("audio") == 1)
            {
                this.registry.set('audio', 0);
                muteText.setText("Unmute");
            }else{
                this.registry.set('audio', 1);
                muteText.setText("Mute");   
            }
        });
        var muteText = this.make.text({
            x : 105,
            y : 60,
            text : 'Mute',
            style : {
                font: '22px monospace',
            }
        }).setOrigin(0.5,0.5);

        var resume = this.add.sprite(520,440,'button').setScale(0.8);
        resume.setInteractive()
        resume.on('pointerdown', () => 
        {
            container.setVisible(false);
            this.count = 3;
            this.container1.setVisible(true);
            // this.scene.resume('GameScene');
        });
        var resumeText = this.make.text({
            x : 520,
            y : 440,
            text : 'Resume',
            style : {
                font: '25px monospace',
            }
        }).setOrigin(0.5,0.5);

        var restart = this.add.sprite(520,560,'button').setScale(0.8);
        restart.setInteractive()
        restart.on('pointerdown', () => 
        {
            container.setVisible(false);
            this.scene.stop("GameScene");
            this.scene.start("GameScene");
            this.scene.start("HudScene");
            this.scene.bringToTop("HudScene");
            this.registry.set("alive", 1);
            this.registry.set("score", 0);
            this.pause = false;
        });
        var restartText = this.make.text({
            x : 520,
            y : 560,
            text : 'Restart',
            style : {
                font: '25px monospace',
            }
        }).setOrigin(0.5,0.5);
        var exit = this.add.sprite(520,680,'button').setScale(0.8);
        exit.setInteractive()
        exit.on('pointerdown', () => 
        {
            container.setVisible(false);
            this.scene.stop("GameScene");
            this.scene.stop("HudScene");
            this.registry.set("score", 0);
            this.scene.start("MenuScene");
            this.pause = false;
        });
        var exitText = this.make.text({
            x : 520,
            y : 680,
            text : 'Exit',
            style : {
                font: '25px monospace',
            }
        }).setOrigin(0.5,0.5);


        this.count = -5;
        this.countText = this.make.text({
            x : 470,
            y : 400,
            text : [this.count + ""],
            style : {
                font: '100px monospace',
                strokeThickness: 4,
            }
          })
        this.updateCount();

        this.scoreText = this.make.text({
            x : 520,
            y : 580,
            text : ['Score: ' + this.registry.get("score")],
            style : {
                font: '25px monospace',
            }
        }).setOrigin(0.5,0.5);
        this.highscoreText = this.make.text({
            x : 520,
            y : 480,
            text : ['HighScore: ' + this.registry.get("highscore")],
            style : {
                font: '25px monospace',
            }
        }).setOrigin(0.5,0.5);
        var exit1 = this.add.sprite(520,800,'button').setScale(0.8);
        exit1.setInteractive()
        exit1.on('pointerdown', () => 
        {
            this.container2.setVisible(false);
            this.scene.stop("GameScene");
            this.scene.stop("HudScene");
            this.registry.set("score", 0);
            this.scene.start("MenuScene");
        });
        var exitText1 = this.make.text({
            x : 520,
            y : 800,
            text : 'Exit',
            style : {
                font: '25px monospace',
            }
        }).setOrigin(0.5,0.5);
        var restart1 = this.add.sprite(520,680,'button').setScale(0.8);
        restart1.setInteractive()
        restart1.on('pointerdown', () => 
        {
            this.container2.setVisible(false);
            this.container3.setVisible(true);
            this.scene.stop("GameScene");
            this.scene.start("GameScene");
            this.scene.restart()
            this.scene.bringToTop("HudScene");
            this.registry.set("alive", 1);
            this.registry.set("score", 0);
        });
        var restartText1 = this.make.text({
            x : 520,
            y : 680,
            text : 'Restart',
            style : {
                font: '25px monospace',
            }
        }).setOrigin(0.5,0.5);
        this.score = this.make.text({
            x : 1100,
            y : 40,
            text : ['SCORE' + ": " + this.registry.get('score')],
            style : {
                font: '40px monospace',
                strokeThickness: 4,
            }
          });
        this.updateScore();

        var container = this.add.container(300,50);
        container.add([menu, resume, resumeText, restart, restartText, exit, exitText]);
        container.setVisible(false);
        this.container1 = this.add.container(300,50);
        this.container1.add([this.countText]);
        this.container1.setVisible(false);
        this.container2 = this.add.container(300,50);
        this.container2.add([menu1, this.scoreText,exit1, exitText1, restart1, restartText1, this.highscoreText]);
        this.container2.setVisible(false);
        this.container3 = this.add.container(0,0);
        this.container3.add([pause, pauseText, mute, muteText, this.score]);
        this.container3.setVisible(true);
    }
    
    update() {
        this.countText.setText(this.count + "");
        if(this.count == 0)
        {
            this.countText.setText("Go!");
            this.count = 0;
        }
        if(this.count == -1)
        {
            this.container1.setVisible(false);
            this.pause = false;
            this.scene.resume("GameScene");
            this.scene.restart();
        }
        if(this.count == -10)
        {
            this.count = -5;
        }
        if(this.registry.get("alive") == 0)
        {   
            console.log(this.registry.get("score"));
            this.scoreText.setText("Score: " + this.registry.get("score"));
            this.highscoreText.setText("HighScore: " + this.registry.get("highscore")); 
            this.container2.setVisible(true);
            this.container3.setVisible(false);
        }
        this.score.setText('SCORE' + ": " + this.registry.get('score'));
    }
    private updateCount() {
        this.time.addEvent({ delay: 1000, callback: this.countDown, callbackScope: this, loop: true}); 
      }
    private countDown() {
        this.count -= 1;
    }
    private updateScore() {
        this.time.addEvent({ delay: 700, callback: this.scoreUP, callbackScope: this, loop: true}); 
      }
    private scoreUP() {
        if(this.registry.get("alive") == 1 && !this.pause)
        {
          this.registry.set('score', this.registry.get('score') + 1);
        }
    }
}