import { AudioSource } from '../types';

interface Track extends AudioSource {
  isPlaying: boolean;
}

export class SoundBank {
  readonly #tracks: Track[] = [];

  constructor(audioSources: AudioSource[]) {
    this.#tracks = audioSources.map(this.#toTrack);
  }

  #toTrack = (audioSource: AudioSource): Track => ({ ...audioSource, isPlaying: false });
  #toAudioSource = ({ isPlaying, ...track }: Track): AudioSource => track;

  #isPlayingTrack = (track: Track): boolean => track.isPlaying === true;

  get #playginTrackIndex(): number | undefined {
    return this.#tracks.findIndex(this.#isPlayingTrack);
  }

  get playingTrack(): AudioSource | undefined {
    return this.#tracks.find(this.#isPlayingTrack);
  }

  #findTrackIndexByName(name: string): number | undefined {
    return this.#tracks.findIndex((track) => track.name === name);
  }

  #unsetPlayingTrack() {
    const playingTrackIndex = this.#playginTrackIndex;

    if (!playingTrackIndex) {
      return;
    }

    this.#tracks[playingTrackIndex].isPlaying = false;
  }

  setPlayingTrack(name: string): AudioSource | undefined {
    this.#unsetPlayingTrack();

    const index = this.#findTrackIndexByName(name);

    if (!index) {
      return;
    }

    const playingTrack = this.#tracks[index];

    playingTrack.isPlaying = true;

    return this.#toAudioSource(playingTrack);
  }
}
