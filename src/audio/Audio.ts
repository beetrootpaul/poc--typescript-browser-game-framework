export class Audio {
  readonly audioContext: AudioContext;

  readonly #globalGainNode: GainNode;

  readonly #muteUnmuteExponentialTimeConstant = 0.1;

  #isMuted: boolean;

  // TODO: REMOVE
  get audioCtx(): AudioContext {
    return this.audioContext;
  }

  // TODO: REMOVE
  get mainGainNode(): GainNode {
    return this.#globalGainNode;
  }

  constructor() {
    this.audioContext = new AudioContext();

    this.#globalGainNode = this.audioContext.createGain();
    this.#globalGainNode.gain.value = 1;
    this.#globalGainNode.connect(this.audioContext.destination);

    this.#isMuted = false;
  }

  // In some browsers audio should start in result of user interaction (e.g. button click).
  // Since we cannot assure it for every game setup, let' expose a function which tries to
  // resume the AudioContext and call it on every user interaction detected by this framework.
  resumeAudioContextIfNeeded(): void {
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume().catch((err) => {
        console.error(err);
      });
      this.#unmute();
    }
  }

  toggle(): void {
    if (this.#isMuted) {
      this.#unmute();
    } else {
      this.#mute();
    }
  }

  #mute(): void {
    this.#isMuted = true;
    this.#globalGainNode.gain.setTargetAtTime(
      0,
      this.audioContext.currentTime,
      this.#muteUnmuteExponentialTimeConstant
    );
  }

  #unmute(): void {
    this.#isMuted = false;
    this.#globalGainNode.gain.setTargetAtTime(
      1,
      this.audioContext.currentTime,
      this.#muteUnmuteExponentialTimeConstant
    );
  }
}
