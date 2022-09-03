import { AudioSource } from '../types';

// audioContext.decodeAudioData
type AudioDecoder = (audioData: ArrayBuffer) => Promise<AudioBuffer>;

interface SoundFile {
  name: string;
  filepath: string;
}

interface Response {
  arrayBuffer: () => Promise<ArrayBuffer>;
}

type Loader = (url: string) => Promise<Response>;

export class BufferLoader {
  readonly #loader: Loader;
  readonly #audioDecoder: AudioDecoder;
  readonly #sourceUrls: SoundFile[];

  constructor(loader: Loader, audioDecoder: AudioDecoder, sourceUrls: SoundFile[]) {
    this.#loader = loader;
    this.#audioDecoder = audioDecoder;
    this.#sourceUrls = sourceUrls;
  }

  async #loadBuffer(path: string): Promise<ArrayBuffer> {
    const response = await this.#loader(path);
    const arrayBuffer = await response.arrayBuffer();
    return arrayBuffer;
  }

  #decode(buffer: ArrayBuffer): Promise<AudioBuffer> {
    return this.#audioDecoder(buffer);
  }

  async load(): Promise<AudioSource[]> {
    const promises = this.#sourceUrls.map(async ({ name, filepath }) => {
      const buffer = await this.#loadBuffer(filepath);
      const audioBuffer = await this.#decode(buffer);

      return { name, audioBuffer };
    });

    const result = await Promise.all(promises);

    return result;
  }
}
