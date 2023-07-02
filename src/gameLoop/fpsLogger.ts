export interface FpsLogger {
  track(fps: number): void;
}

export class FpsLoggerNoop implements FpsLogger {
  track(_fps: number): void {}
}

export class FpsLoggerAverage implements FpsLogger {
  readonly #samples: number[] = Array.from({ length: 60 });
  #nextIndex: number = 0;

  track(fps: number): void {
    this.#samples[this.#nextIndex++] = fps;
    this.#nextIndex = this.#nextIndex % this.#samples.length;
    if (this.#nextIndex === 0) {
      const s = this.#samples.reduce((sum, nextFps) => sum + nextFps, 0);
      const averageFps = s / this.#samples.length;
      console.debug("FPS: ", Math.floor(averageFps));
    }
  }
}
