export class AudioSources {
    audioHit : Phaser.Sound.BaseSound;
    audioRotate : Phaser.Sound.BaseSound;
    audioShoot : Phaser.Sound.BaseSound;
    audioExplode : Phaser.Sound.BaseSound;

    constructor(scene : Phaser.Scene)
    {
        // this.audioBg = scene.sound.add('oggy', {loop : true});
        this.audioHit = scene.sound.add('hit', {loop : false});
        this.audioRotate = scene.sound.add('rotate', {loop : false});
        this.audioShoot = scene.sound.add('shoot', {loop : false});
        this.audioExplode = scene.sound.add('explosion', {loop: false});
    }

}