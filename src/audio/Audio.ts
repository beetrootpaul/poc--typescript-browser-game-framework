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

  constructor(muteButtonsSelector: string) {
    document
      .querySelectorAll<HTMLElement>(muteButtonsSelector)
      .forEach((button) => {
        // TODO: consider handling it through mute_unmute_toggle game input event :thinking:
        button.addEventListener("click", () => {
          this.toggle();
        });
      });

    this.audioContext = new AudioContext();

    this.#globalGainNode = this.audioContext.createGain();
    this.#globalGainNode.gain.value = 1;
    this.#globalGainNode.connect(this.audioContext.destination);

    this.#isMuted = false;
  }

  toggle(): void {
    if (this.#isMuted) {
      this.#isMuted = false;
      this.#globalGainNode.gain.setTargetAtTime(
        1,
        this.audioContext.currentTime,
        this.#muteUnmuteExponentialTimeConstant
      );
    } else {
      this.#isMuted = true;
      this.#globalGainNode.gain.setTargetAtTime(
        0,
        this.audioContext.currentTime,
        this.#muteUnmuteExponentialTimeConstant
      );
    }
  }
}
