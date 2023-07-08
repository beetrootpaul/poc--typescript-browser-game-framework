import { SolidColor } from "./Color.ts";
import { DrawApi } from "./DrawApi.ts";
import { FullScreen } from "./FullScreen.ts";
import { GameInput } from "./game_input/GameInput.ts";
import { GameLoop } from "./game_loop/GameLoop.ts";
import { Loading } from "./Loading.ts";
import { PocTsBGFramework } from "./PocTsBGFramework.ts";
import { StorageApi } from "./StorageApi.ts";
import { Xy } from "./Xy.ts";

export type FrameworkOptions = {
  htmlDisplaySelector: string;
  htmlCanvasSelector: string;
  htmlOffscreenCanvasFallbackSelector: string;
  htmlControlsFullscreenSelector: string;
  htmlCanvasBackground: SolidColor;
  gameCanvasSize: Xy;
  desiredFps: number;
  logActualFps?: boolean;
  debug?: {
    enabledOnInit: boolean;
    /**
     * A key to toggle debug mode on/off. Has to match a
     * [KeyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)
     * of a desired key.
     */
    toggleKey?: string;
  };
};

export class Framework {
  readonly #debugOptions: FrameworkOptions["debug"];
  #debug: boolean;
  get debug(): boolean {
    return this.#debug;
  }

  readonly #gameCanvasSize: Xy;
  readonly #htmlCanvasBackground: SolidColor;

  readonly #htmlCanvasContext: CanvasRenderingContext2D;
  readonly #offscreenContext:
    | OffscreenCanvasRenderingContext2D
    | CanvasRenderingContext2D;
  readonly #offscreenImageData: ImageData;

  readonly #loading: Loading;
  readonly #gameInput: GameInput;
  readonly #gameLoop: GameLoop;
  readonly #fullScreen: FullScreen;

  readonly #drawApi: DrawApi;
  readonly #storageApi: StorageApi;

  #onUpdate?: () => void;
  #onDraw?: () => void;

  #scaleToFill = 1;
  #centeringOffset = Xy.zero;

  constructor(options: FrameworkOptions) {
    this.#debugOptions = options.debug ?? {
      enabledOnInit: false,
    };
    this.#debug = this.#debugOptions?.enabledOnInit;

    this.#loading = new Loading(options.htmlDisplaySelector);

    this.#gameCanvasSize = options.gameCanvasSize.floor();
    this.#htmlCanvasBackground = options.htmlCanvasBackground;

    const htmlCanvas = document.querySelector<HTMLCanvasElement>(
      options.htmlCanvasSelector
    );
    if (!htmlCanvas) {
      throw Error(
        `Was unable to find <canvas> by selector '${options.htmlCanvasSelector}'`
      );
    }

    const htmlCanvasContext = htmlCanvas.getContext("2d", {
      // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#turn_off_transparency
      alpha: false,
    });
    if (!htmlCanvasContext) {
      throw Error("Was unable to obtain <canvas>' 2D context");
    }
    this.#htmlCanvasContext = htmlCanvasContext;

    if (typeof OffscreenCanvas == "undefined") {
      console.warn(
        "No OffscreenCanvas support. Falling back to a regular <canvas>."
      );
      const htmlOffscreenCanvasFallback =
        document.querySelector<HTMLCanvasElement>(
          options.htmlOffscreenCanvasFallbackSelector
        );
      if (!htmlOffscreenCanvasFallback) {
        throw Error(
          `Was unable to find a fallback offscreen <canvas> by selector '${options.htmlOffscreenCanvasFallbackSelector}'`
        );
      }
      htmlOffscreenCanvasFallback.width = options.gameCanvasSize.x;
      htmlOffscreenCanvasFallback.height = options.gameCanvasSize.y;
      const fallbackOffscreenContext = htmlOffscreenCanvasFallback.getContext(
        "2d",
        {
          // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#turn_off_transparency
          alpha: false,
        }
      );
      if (!fallbackOffscreenContext) {
        throw Error(
          "Was unable to obtain fallback offscreen canvas' 2D context"
        );
      }
      this.#offscreenContext = fallbackOffscreenContext;
    } else {
      const offscreenCanvas = new OffscreenCanvas(
        options.gameCanvasSize.x,
        options.gameCanvasSize.y
      );
      const offscreenContext = offscreenCanvas.getContext("2d", {
        // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#turn_off_transparency
        alpha: false,
      });
      if (!offscreenContext) {
        throw Error("Was unable to obtain OffscreenCanvas' 2D context");
      }
      this.#offscreenContext = offscreenContext;
    }

    this.#gameInput = new GameInput({
      debugToggleKey: this.#debugOptions?.toggleKey,
    });

    this.#gameLoop = new GameLoop({
      desiredFps: options.desiredFps,
      logActualFps: options.logActualFps ?? false,
    });

    this.#fullScreen = FullScreen.newFor(
      options.htmlDisplaySelector,
      options.htmlControlsFullscreenSelector
    );

    this.#offscreenImageData = this.#offscreenContext.createImageData(
      this.#offscreenContext.canvas.width,
      this.#offscreenContext.canvas.height
    );
    this.#drawApi = new DrawApi(
      this.#gameCanvasSize,
      this.#offscreenImageData.data
    );

    this.#storageApi = new StorageApi();

    PocTsBGFramework.drawApi = this.#drawApi;
    PocTsBGFramework.storageApi = this.#storageApi;
  }

  setOnUpdate(onUpdate: () => void) {
    this.#onUpdate = onUpdate;
  }

  setOnDraw(onDraw: () => void) {
    this.#onDraw = onDraw;
  }

  // TODO: How to prevent an error of calling startGame twice? What would happen if called twice?
  startGame(onStart?: () => void): void {
    this.#setupHtmlCanvas();
    window.addEventListener("resize", (_event) => {
      this.#setupHtmlCanvas();
    });

    // TODO: rename to make it clear this will happen before the game loop starts and game gets rendered
    onStart?.();

    this.#loading.showApp();

    this.#gameInput.startListening();

    this.#gameLoop.start({
      updateFn: (frameNumber) => {
        const fireOnceEvents = this.#gameInput.consumeFireOnceEvents();
        if (fireOnceEvents.has("full_screen")) {
          this.#fullScreen.toggle();
        }
        if (fireOnceEvents.has("debug_toggle")) {
          this.#debug = !this.#debug;
          this.#redrawDebugMargin();
        }
        const continuousEvents = this.#gameInput.getCurrentContinuousEvents();

        PocTsBGFramework.frameNumber = frameNumber;
        PocTsBGFramework.gameInputEvents = continuousEvents;

        this.#onUpdate?.();
      },
      renderFn: () => {
        this.#onDraw?.();
        this.#render();
      },
    });
  }

  // This function assumes that <canvas> has width and height set to 100% by CSS.
  #setupHtmlCanvas(): void {
    // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#scaling_for_high_resolution_displays
    this.#htmlCanvasContext.canvas.width =
      this.#htmlCanvasContext.canvas.getBoundingClientRect().width *
      window.devicePixelRatio;
    this.#htmlCanvasContext.canvas.height =
      this.#htmlCanvasContext.canvas.getBoundingClientRect().height *
      window.devicePixelRatio;

    this.#htmlCanvasContext.imageSmoothingEnabled = false;

    this.#htmlCanvasContext.fillStyle =
      this.#htmlCanvasBackground.asRgbCssHex();
    this.#htmlCanvasContext.fillRect(
      0,
      0,
      this.#htmlCanvasContext.canvas.width,
      this.#htmlCanvasContext.canvas.height
    );
  }

  #render(): void {
    this.#offscreenContext.putImageData(this.#offscreenImageData, 0, 0);

    const htmlCanvasSize = new Xy(
      this.#htmlCanvasContext.canvas.width,
      this.#htmlCanvasContext.canvas.height
    );
    // TODO: encapsulate this calculation and related fields
    this.#scaleToFill = htmlCanvasSize.div(this.#gameCanvasSize).floor().min();
    this.#centeringOffset = htmlCanvasSize
      .sub(this.#gameCanvasSize.mul(this.#scaleToFill))
      .div(2)
      .floor();

    this.#redrawDebugMargin();

    this.#htmlCanvasContext.drawImage(
      this.#offscreenContext.canvas,
      0,
      0,
      this.#offscreenContext.canvas.width,
      this.#offscreenContext.canvas.height,
      this.#centeringOffset.x,
      this.#centeringOffset.y,
      this.#scaleToFill * this.#gameCanvasSize.x,
      this.#scaleToFill * this.#gameCanvasSize.y
    );
  }

  #redrawDebugMargin(): void {
    const debugBgMargin = 1;
    this.#htmlCanvasContext.fillStyle = this.#debug
      ? "#ff0000"
      : this.#htmlCanvasBackground.asRgbCssHex();
    this.#htmlCanvasContext.fillRect(
      this.#centeringOffset.x - debugBgMargin,
      this.#centeringOffset.y - debugBgMargin,
      this.#scaleToFill * this.#gameCanvasSize.x + 2 * debugBgMargin,
      this.#scaleToFill * this.#gameCanvasSize.y + 2 * debugBgMargin
    );
  }
}
