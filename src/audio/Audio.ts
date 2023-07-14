export class Audio {
  constructor(muteButtonsSelector: string) {
    document
      .querySelectorAll<HTMLElement>(muteButtonsSelector)
      .forEach((button) => {
        // TODO: consider handling it through mute_unmute_toggle game input event :thinking:
        button.addEventListener("click", () => {
          this.toggle();
        });
      });
  }

  toggle(): void {
    // TODO: implement
    console.log("AUDIO TOGGLE");
  }
}
