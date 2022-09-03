import { EventEmitter } from '../EventEmitter';

type TimerEvents = 'start' | 'tick' | 'stop' | 'error';
type EventHandler = () => void;
type Disposep = () => void;

export class Timer {
  #timeout!: NodeJS.Timeout;
  #expectedTime!: number;
  #timeInterval: number;
  readonly #eventEmitter = new EventEmitter();

  constructor(timeInterval: number) {
    this.#timeInterval = timeInterval;
  }

  #setTimer(interval: number): void {
    this.#timeout = setTimeout(this.tick, interval);
  }

  tick(): void {
    const timerDrift = Date.now() - this.#expectedTime;

    if (timerDrift > this.#timeInterval) {
      this.#eventEmitter.emit('error', {
        error: 'Timer drift is more than interval',
        timerDrift,
        timeInterval: this.#timeInterval,
      });
    }

    this.#eventEmitter.emit('tick');

    this.#expectedTime += this.#timeInterval;

    this.#setTimer(this.#timeInterval - timerDrift);
  }

  setInterval(interval: number): void {
    this.#timeInterval = interval;
  }

  start(): void {
    this.#expectedTime = Date.now() + this.#timeInterval;

    this.#setTimer(this.#timeInterval);

    this.#eventEmitter.emit('start');
  }

  stop(): void {
    clearTimeout(this.#timeout);
    this.#eventEmitter.emit('stop');
  }

  subscribe(event: TimerEvents, handler: EventHandler): Disposep {
    return this.#eventEmitter.subscribe(event, handler);
  }

  unsubscribe(event: TimerEvents, handler: EventHandler): void {
    this.#eventEmitter.unsubscribe(event, handler);
  }
}
