// constructor options for MusicTracks
export interface MusicTracksOptions {
    sound: Phaser.Sound.BaseSoundManager;
    songName: string;
    trackFlags: {[key in TrackName]?: boolean};
}

export type TrackName = 'melodica' | 'ocarina' | 'rhythm' | 'uke' | 'vocal-guitar';
export const TRACK_NAMES: TrackName[] = ['melodica', 'ocarina', 'rhythm', 'uke', 'vocal-guitar'];

export type TrackKey =
    'melodica' | 'ocarina' | 'rhythm' | 'uke' | 'vocal-guitar' |
    'melodica-ocarina' | 'melodica-rhythm' | 'melodica-uke' |
    'ocarina-rhythm' | 'ocarina-uke' |
    'rhythm-uke'
export const TRACK_KEYS: TrackKey[] = [
    'melodica', 'ocarina', 'rhythm', 'uke', 'vocal-guitar',
    'melodica-ocarina', 'melodica-rhythm', 'melodica-uke',
    'ocarina-rhythm', 'ocarina-uke',
    'rhythm-uke'
];

/**
 * Structure to hold the various music tracks for a song.
 */
export class MusicTracks {

    private sound: Phaser.Sound.BaseSoundManager;
    private songName: string;
    private trackFlags: {[key in TrackName]?: boolean};
    private tracks: {[key in TrackKey]?: Phaser.Sound.BaseSound};
    private volume: number;

    constructor(options: MusicTracksOptions) {
        this.sound = options.sound;
        this.songName = options.songName;
        this.trackFlags = options.trackFlags;
        this.tracks = {};
        this.volume = 0;

        // gather track name pairs for CPU efficiency purposes. skip 'vocal-guitar' since that one usually always
        // plays.
        let trackNamePairs: TrackName[][] = [];
        let trackNamePair: TrackName[] = [];
        for (let trackName of Object.keys(this.trackFlags) as TrackName[]) {
            let trackFlag: boolean = this.trackFlags[trackName];
            if (trackFlag && trackName !== 'vocal-guitar') {
                trackNamePair.push(trackName);
            }
            if (trackNamePair.length === 2) {
                trackNamePairs.push(trackNamePair);
                trackNamePair = [];
            }
        }
        if (trackNamePair.length > 0) {
            trackNamePairs.push(trackNamePair);
        }

        // create tracks for track name pairs
        /*
        for (let trackNamePair of trackNamePairs) {
            let trackKey: TrackKey = this.fromTrackNamePairToKey(trackNamePair);
            this.tracks[trackKey] = this.sound.add(this.songName + '-' + trackKey, {volume: 0});
        }
        // create 'vocal-guitar' track if needed
        if (this.trackFlags['vocal-guitar']) {
            this.tracks['vocal-guitar'] = this.sound.add(this.songName + '-vocal-guitar', {volume: 0});
        }
         */

        for (let trackName of TRACK_NAMES) {
            this.tracks[trackName] = this.sound.add(this.songName + '-' + trackName, {volume: 0});
        }
    }

    /**
     * Updates the track flags on-the-fly. Let you start/stop tracks on-the-fly.
     */
    setTrackFlags(trackFlags: {[key in TrackName]?: boolean}) {
        for (let trackName of TRACK_NAMES) {
            let oldTrackFlag: boolean = this.trackFlags[trackName];
            let newTrackFlag: boolean = trackFlags[trackName];
            let stopTrack: boolean = oldTrackFlag && newTrackFlag === false;
            let startTrack: boolean = !oldTrackFlag && newTrackFlag === true;
            let track = this.tracks[trackName] as Phaser.Sound.WebAudioSound;
            if (stopTrack) {
                this.trackFlags[trackName] = false;
                track.setVolume(0);
            } else if (startTrack) {
                this.trackFlags[trackName] = true;
                track.setVolume(this.volume);
            }
        }
    }

    play(config?: Phaser.Types.Sound.SoundConfig): void {
        // play all tracks as quickly as possible to ensure they are in sync
        for (let trackKey of Object.keys(this.tracks) as TrackKey[]) {
            let track = this.tracks[trackKey] as Phaser.Sound.BaseSound;
            track.play(config);
        }
        // when all tracks complete
        let trackKeys = Object.keys(this.tracks) as TrackKey[]
        let onCompleteCallsLeft = trackKeys.length;
        for (let trackKey of trackKeys) {
            this.tracks[trackKey].on('complete', () => {
                onCompleteCallsLeft--;
                if (onCompleteCallsLeft <= 0) {
                    onCompleteCallsLeft = trackKeys.length;
                    // re-play all tracks as quickly as possible to ensure they are in sync
                    // IMPORTANT: must manually loop because automatic looping is not precise enough
                    for (let trackKey of Object.keys(this.tracks) as TrackKey[]) {
                        let track = this.tracks[trackKey] as Phaser.Sound.BaseSound;
                        track.play();
                    }
                }
            });
        }
    }

    stop(): void {
        for (let trackKey of Object.keys(this.tracks) as TrackKey[]) {
            let track = this.tracks[trackKey] as Phaser.Sound.BaseSound;
            track.stop();
        }
    }

    isPlaying(): boolean {
        for (let trackKey of Object.keys(this.tracks) as TrackKey[]) {
            let track = this.tracks[trackKey] as Phaser.Sound.BaseSound;
            if (track.isPlaying) {
                return true;
            }
        }
        return false;
    }

    fadeIn(scene: Phaser.Scene, fullVolume: number, fadeMillis: number, fadeInComplete?: () => void): void {
        this.volume = fullVolume;
        let onCompleteCallsLeft = 0;
        for (let trackKey of Object.keys(this.tracks)) {
            if (!this.trackFlags[trackKey]) {
                continue;
            }
            let track: Phaser.Sound.BaseSound = this.tracks[trackKey];
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

    fadeOut(scene: Phaser.Scene, fadeMillis: number, fadeOutComplete?: () => void): void {
        this.volume = 0;
        let onCompleteCallsLeft = 0;
        for (let trackKey of Object.keys(this.tracks)) {
            let track: Phaser.Sound.BaseSound = this.tracks[trackKey];
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

    /**
     * Converts from a {@link TrackName} pair to a {@link TrackKey}.
     */
    private fromTrackNamePairToKey(trackNamePair: TrackName[]): TrackKey {
        if (trackNamePair.length === 1) {
            return trackNamePair[0];
        }
        if (TRACK_KEYS.indexOf(trackNamePair[0] + '-' + trackNamePair[1] as TrackKey) >= 0) {
            return trackNamePair[0] + '-' + trackNamePair[1] as TrackKey;
        } else {
            return trackNamePair[1] + '-' + trackNamePair[0] as TrackKey;
        }
    }
}
