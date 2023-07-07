import { SolidColor } from "./Color.ts";
import { DrawApi } from "./DrawApi.ts";
import { FullScreen } from "./FullScreen.ts";
import { GameInput, GameInputEvent } from "./game_input/GameInput.ts";
import { GameLoop } from "./game_loop/GameLoop.ts";
import { Loading } from "./Loading.ts";
import { StorageApi, StorageApiValueConstraint } from "./StorageApi.ts";
import { Xy } from "./Xy.ts";

export type GameStartContext<
  StorageApiValue extends StorageApiValueConstraint
> = {
  storageApi: StorageApi<StorageApiValue>;
};
export type GameUpdateContext<
  StorageApiValue extends StorageApiValueConstraint
> = {
  frameNumber: number;
  gameInputEvents: Set<GameInputEvent>;
  storageApi: StorageApi<StorageApiValue>;
};
export type GameDrawContext = {
  drawApi: DrawApi;
};

export type GameOnStart<StorageApiValue extends StorageApiValueConstraint> = (
  startContext: GameStartContext<StorageApiValue>
) => void;
export type GameOnUpdate<StorageApiValue extends StorageApiValueConstraint> = (
  updateContext: GameUpdateContext<StorageApiValue>
) => void;
export type GameOnDraw = (drawContext: GameDrawContext) => void;

type FrameworkOptions = {
  htmlDisplaySelector: string;
  htmlCanvasSelector: string;
  htmlOffscreenCanvasFallbackSelector: string;
  htmlControlsFullscreenSelector: string;
  htmlCanvasBackground: SolidColor;
  gameCanvasSize: Xy;
  desiredFps: number;
  logActualFps?: boolean;
  debug?: boolean;
};

export class Framework<StorageApiValue extends StorageApiValueConstraint> {
  readonly #debug: boolean;

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
  readonly #storageApi: StorageApi<StorageApiValue>;

  #onUpdate?: GameOnUpdate<StorageApiValue>;
  #onDraw?: GameOnDraw;

  constructor(options: FrameworkOptions) {
    this.#debug = options.debug ?? false;

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

    this.#gameInput = new GameInput();

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

    this.#storageApi = new StorageApi<StorageApiValue>();
  }

  setOnUpdate(onUpdate: GameOnUpdate<StorageApiValue>) {
    this.#onUpdate = onUpdate;
  }

  setOnDraw(onDraw: GameOnDraw) {
    this.#onDraw = onDraw;
  }

  startGame(onStart?: GameOnStart<StorageApiValue>): void {
    this.#setupHtmlCanvas();
    window.addEventListener("resize", (_event) => {
      this.#setupHtmlCanvas();
    });

    // TODO: rename to make it clear this will happen before the game loop starts and game gets rendered
    onStart?.({
      storageApi: this.#storageApi,
    });

    this.#loading.showApp();

    this.#gameInput.startListening();

    this.#gameLoop.start({
      updateFn: (frameNumber) => {
        const fireOnceEvents = this.#gameInput.consumeFireOnceEvents();
        if (fireOnceEvents.has("full_screen")) {
          this.#fullScreen.toggle();
        }
        const continuousEvents = this.#gameInput.getCurrentContinuousEvents();
        this.#onUpdate?.({
          frameNumber,
          gameInputEvents: continuousEvents,
          storageApi: this.#storageApi,
        });
      },
      renderFn: () => {
        this.#onDraw?.({
          drawApi: this.#drawApi,
        });
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
    const scaleToFill = htmlCanvasSize.div(this.#gameCanvasSize).floor().min();
    const centeringOffset = htmlCanvasSize
      .sub(this.#gameCanvasSize.mul(scaleToFill))
      .div(2)
      .floor();

    if (this.#debug) {
      const debugBgMargin = 1;
      this.#htmlCanvasContext.fillStyle = "#ff0000";
      this.#htmlCanvasContext.fillRect(
        centeringOffset.x - debugBgMargin,
        centeringOffset.y - debugBgMargin,
        scaleToFill * this.#gameCanvasSize.x + 2 * debugBgMargin,
        scaleToFill * this.#gameCanvasSize.y + 2 * debugBgMargin
      );
    }

    this.#htmlCanvasContext.drawImage(
      this.#offscreenContext.canvas,
      0,
      0,
      this.#offscreenContext.canvas.width,
      this.#offscreenContext.canvas.height,
      centeringOffset.x,
      centeringOffset.y,
      scaleToFill * this.#gameCanvasSize.x,
      scaleToFill * this.#gameCanvasSize.y
    );
  }
}
