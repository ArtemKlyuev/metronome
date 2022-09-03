export class AudioPlayer {
  readonly #audioContext: AudioContext;
  readonly #gainNode: GainNode;
  readonly #audioSource: AudioBufferSourceNode;

  constructor(audioContext: AudioContext) {
    this.#audioContext = audioContext;
    this.#gainNode = this.#audioContext.createGain();
    this.#audioSource = this.#audioContext.createBufferSource();

    this.#audioSource.connect(this.#audioContext.destination);
  }

  loadAudio(audioBuffer: AudioBuffer): void {
    this.#audioSource.buffer = audioBuffer;
  }

  play(): void {
    this.#audioSource.start();
  }

  stop(): void {
    this.#audioSource.stop();
  }

  setVolume(volume: number): void {
    this.#gainNode.gain.value = volume;
  }
}
