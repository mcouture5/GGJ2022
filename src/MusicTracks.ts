/**
 * Structure to hold the various music tracks for a song.
 */
import { GameScene } from "./scenes/GameScene";

export interface MusicTracks {
    melodica?: Phaser.Sound.BaseSound;
    ocarina?: Phaser.Sound.BaseSound;
    rhythm?: Phaser.Sound.BaseSound;
    uke?: Phaser.Sound.BaseSound;
    vocalGuitar?: Phaser.Sound.BaseSound;
}

export class MusicUtils {

    /**
     * Simultaneously plays a bunch of music tracks all at once in perfect sync.
     */
    static play(music: MusicTracks) {
        music.melodica && music.melodica.play();
        music.ocarina && music.ocarina.play();
        music.rhythm && music.rhythm.play();
        music.uke && music.uke.play();
        music.vocalGuitar && music.vocalGuitar.play();
    }

    /**
     * Simultaneously fades in a bunch of music tracks all at once in perfect sync.
     */
    static fadeIn(scene: Phaser.Scene, music: MusicTracks, fullVolume: number, fadeMillis: number, fadeInComplete?: () => void) {
        let onCompleteCallsLeft = 0;
        for (let trackName of Object.keys(music)) {
            let track: Phaser.Sound.BaseSound = music[trackName];
            if (!track) {
                continue;
            }
            onCompleteCallsLeft++;
            scene.add.tween({
                targets: track,
                volume: fullVolume,
                ease: 'Linear',
                duration: fadeMillis,
                onComplete: () => {
                    onCompleteCallsLeft--;
                    if (onCompleteCallsLeft <= 0) {
                        fadeInComplete && fadeInComplete();
                    }
                }
            });
        }
    }

    /**
     * Simultaneously fades out a bunch of music tracks all at once in perfect sync.
     */
    static fadeOut(scene: GameScene, music: MusicTracks, fadeMillis: number, fadeOutComplete?: () => void) {
        let onCompleteCallsLeft = 0;
        for (let trackName of Object.keys(music)) {
            let track: Phaser.Sound.BaseSound = music[trackName];
            if (!track) {
                continue;
            }
            onCompleteCallsLeft++;
            scene.add.tween({
                targets: track,
                volume: 0,
                ease: 'Linear',
                duration: fadeMillis,
                onComplete: () => {
                    track.stop();
                    onCompleteCallsLeft--;
                    if (onCompleteCallsLeft <= 0) {
                        fadeOutComplete && fadeOutComplete();
                    }
                }
            });
        }
    }
}
