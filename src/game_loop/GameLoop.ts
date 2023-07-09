import { FpsLogger, FpsLoggerAverage, FpsLoggerNoop } from "./FpsLogger.ts";

type GameLoopCallbacks = {
  updateFn: (frameNumber: number) => void;
  renderFn: () => void;
};

type GameLoopOptions = {
  desiredFps: number;
  logActualFps: boolean;
};

export class GameLoop {
  readonly #desiredFps: number;
  #adjustedFps: number;

  readonly #fpsLogger: FpsLogger;

  #previousTime?: DOMHighResTimeStamp;
  #expectedTimeStep: number;
  #safetyMaxTimeStep: number;
  #accumulatedTimeStep: number;

  #frameNumber: number;

  #callbacks: GameLoopCallbacks;

  constructor({ desiredFps, logActualFps }: GameLoopOptions) {
    this.#desiredFps = desiredFps;
    this.#adjustedFps = desiredFps;

    this.#fpsLogger = logActualFps
      ? new FpsLoggerAverage()
      : new FpsLoggerNoop();

    this.#expectedTimeStep = 1000 / this.#adjustedFps;
    this.#safetyMaxTimeStep = 5 * this.#expectedTimeStep;
    this.#accumulatedTimeStep = this.#expectedTimeStep;

    this.#frameNumber = 0;

    this.#callbacks = {
      updateFn: () => {},
      renderFn: () => {},
    };
  }

  start(callbacks: GameLoopCallbacks): void {
    this.#callbacks = callbacks;
    window.requestAnimationFrame(this.#tick);
  }

  // TODO: seems like the game runs faster on a mobile browser than on a desktop one

  // Keep this function as an arrow one in order to avoid issues with `this`.
  #tick = (currentTime: DOMHighResTimeStamp): void => {
    // In the 1st frame, we don't have this.#previousTime yet, therefore we take currentTime
    //   and remove 1 to avoid delta time of 0 and FPS of Infinity:
    const deltaTime = currentTime - (this.#previousTime ?? currentTime - 1);

    this.#previousTime = currentTime;
    this.#accumulatedTimeStep += deltaTime;
    // A safety net in case of a long time spent on another tab, letting delta accumulate a lot in this one:
    if (this.#accumulatedTimeStep > this.#safetyMaxTimeStep) {
      console.debug(
        `Accumulated time step of ${
          this.#accumulatedTimeStep
        } was greater than safety max time step of ${this.#safetyMaxTimeStep}.`
      );
      this.#accumulatedTimeStep = this.#safetyMaxTimeStep;
    }

    if (this.#accumulatedTimeStep >= this.#expectedTimeStep) {
      const actualFps = 1000 / this.#accumulatedTimeStep;
      this.#fpsLogger.track(actualFps);

      // TODO: make sure console.debug are not spammed on prod build
      if (
        actualFps > this.#desiredFps * 1.1 &&
        this.#adjustedFps > this.#desiredFps / 2
      ) {
        this.#adjustedFps -= 1;
        this.#expectedTimeStep = 1000 / this.#adjustedFps;
        console.debug(
          `Decreasing the adjusted FPS by 1. New = ${this.#adjustedFps}`
        );
      } else if (
        actualFps < this.#desiredFps / 1.1 &&
        this.#adjustedFps < this.#desiredFps * 2
      ) {
        this.#adjustedFps += 1;
        this.#expectedTimeStep = 1000 / this.#adjustedFps;
        console.debug(
          `Increasing the adjusted FPS by 1. New = ${this.#adjustedFps}`
        );
      }
    }

    while (this.#accumulatedTimeStep >= this.#expectedTimeStep) {
      this.#callbacks.updateFn(this.#frameNumber);

      this.#frameNumber =
        this.#frameNumber == Number.MAX_SAFE_INTEGER
          ? 0
          : this.#frameNumber + 1;

      this.#accumulatedTimeStep -= this.#expectedTimeStep;
    }

    this.#callbacks.renderFn();

    // TODO: pass `requestAnimationFrame` as an external param and cover this game loop logic with tests based on mocked `requestAnimationFrame`
    window.requestAnimationFrame(this.#tick);
  };
}
