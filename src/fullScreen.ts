declare global {
  interface Document {
    webkitFullscreenEnabled?: boolean;
    webkitFullscreenElement?: () => Element;
    webkitExitFullscreen?: () => void;
  }

  interface Element {
    webkitRequestFullscreen?: () => void;
  }
}

export abstract class FullScreen {
  static newFor(
    fullScreenSubjectSelector: string,
    buttonsSelector: string
  ): FullScreen {
    // TODO: implement for Safari 16.4 as well, but only after testing everything else on the older Safari 16.3,
    //       because Safari downgrade might be difficult to achieve (it updates together with macOS update).
    return document.fullscreenEnabled || document.webkitFullscreenEnabled
      ? new FullScreenSupported(fullScreenSubjectSelector, buttonsSelector)
      : new FullScreenNoop(buttonsSelector);
  }

  abstract toggle(): void;
}

class FullScreenNoop implements FullScreen {
  constructor(buttonsSelector: string) {
    document
      .querySelectorAll<HTMLElement>(buttonsSelector)
      .forEach((button) => {
        button.style.display = "none";
      });
  }

  toggle(): void {}
}

// noinspection SuspiciousTypeOfGuard
class FullScreenSupported implements FullScreen {
  readonly #fullScreenSubject: Element;

  readonly #nativeRequestFullscreen: () => void | Promise<void>;
  readonly #nativeExitFullscreen: () => void | Promise<void>;

  constructor(fullScreenSubjectSelector: string, buttonsSelector: string) {
    const fullScreenSubject = document.querySelector(fullScreenSubjectSelector);
    if (!fullScreenSubject) {
      throw Error(
        `Was unable to find a full screen subject by selector '${fullScreenSubjectSelector}'`
      );
    }
    this.#fullScreenSubject = fullScreenSubject;

    const nativeRequestFullscreen =
      this.#fullScreenSubject.requestFullscreen ??
      this.#fullScreenSubject.webkitRequestFullscreen ??
      (() => {});
    this.#nativeRequestFullscreen = nativeRequestFullscreen.bind(
      this.#fullScreenSubject
    );

    const nativeExitFullscreen =
      document.exitFullscreen ?? document.webkitExitFullscreen ?? (() => {});
    this.#nativeExitFullscreen = nativeExitFullscreen.bind(document);

    document
      .querySelectorAll<HTMLElement>(buttonsSelector)
      .forEach((button) => {
        // TODO: consider handling it through full_screen game input event :thinking:
        button.addEventListener("click", () => {
          this.toggle();
        });
      });
  }

  toggle(): void {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      this.#fullScreenOff();
    } else {
      this.#fullScreenOn();
    }
  }

  #fullScreenOn(): void {
    const result = this.#nativeRequestFullscreen();
    if (result instanceof Promise) {
      result.catch((err) => {
        console.error(err);
      });
    }
  }

  #fullScreenOff(): void {
    const result = this.#nativeExitFullscreen();
    if (result instanceof Promise) {
      result.catch((err) => {
        console.error(err);
      });
    }
  }
}
