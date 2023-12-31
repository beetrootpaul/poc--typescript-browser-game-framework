import { Assets, FontAsset, ImageUrl } from "../Assets";
import { Color, ColorId, CompositeColor, SolidColor } from "../Color";
import { Font } from "../font/Font";
import { Sprite } from "../Sprite";
import { Xy, xy_ } from "../Xy";
import { DrawClear } from "./DrawClear";
import { DrawEllipse } from "./DrawEllipse";
import { DrawPixel } from "./DrawPixel";
import { DrawRect } from "./DrawRect";
import { DrawSprite } from "./DrawSprite";
import { DrawText } from "./DrawText";
import { FillPattern } from "./FillPattern";

type DrawApiOptions = {
  // TODO: better name to indicate in-out nature of this param? Or some info in JSDoc?
  canvasBytes: Uint8ClampedArray;
  canvasSize: Xy;
  assets: Assets;
};

export class DrawApi {
  readonly #assets: Assets;

  readonly #clear: DrawClear;
  readonly #pixel: DrawPixel;
  readonly #rect: DrawRect;
  readonly #ellipse: DrawEllipse;
  readonly #sprite: DrawSprite;
  readonly #text: DrawText;

  #cameraOffset: Xy = xy_(0, 0);

  #fillPattern: FillPattern = FillPattern.primaryOnly;

  #fontAsset: FontAsset | null = null;

  readonly #spriteColorMapping: Map<ColorId, Color> = new Map();

  constructor(options: DrawApiOptions) {
    this.#assets = options.assets;

    this.#clear = new DrawClear(
      options.canvasBytes,
      options.canvasSize.round()
    );
    this.#pixel = new DrawPixel(
      options.canvasBytes,
      options.canvasSize.round()
    );
    this.#rect = new DrawRect(options.canvasBytes, options.canvasSize.round());
    this.#ellipse = new DrawEllipse(
      options.canvasBytes,
      options.canvasSize.round()
    );
    this.#sprite = new DrawSprite(
      options.canvasBytes,
      options.canvasSize.round()
    );
    this.#text = new DrawText(options.canvasBytes, options.canvasSize.round());
  }

  // TODO: cover it with tests, e.g. make sure that fill pattern is applied on a canvas from its left-top in (0,0), no matter what the camera offset is
  // noinspection JSUnusedGlobalSymbols
  setCameraOffset(offset: Xy): void {
    this.#cameraOffset = offset.round();
  }

  // TODO: cover it with tests
  // noinspection JSUnusedGlobalSymbols
  setFillPattern(fillPattern: FillPattern): void {
    this.#fillPattern = fillPattern;
  }

  // TODO: cover it with tests
  // noinspection JSUnusedGlobalSymbols
  mapSpriteColor(from: Color, to: Color): void {
    // TODO: consider writing a custom equality check function
    if (from.id() === to.id()) {
      this.#spriteColorMapping.delete(from.id());
    } else {
      this.#spriteColorMapping.set(from.id(), to);
    }
  }

  // TODO: cover it with tests
  // noinspection JSUnusedGlobalSymbols
  setFont(fontImageUrl: string | null): void {
    this.#fontAsset = fontImageUrl ? this.#assets.getFont(fontImageUrl) : null;
  }

  // noinspection JSUnusedGlobalSymbols
  getFont(): Font | null {
    return this.#fontAsset?.font ?? null;
  }

  // noinspection JSUnusedGlobalSymbols
  clear(color: SolidColor): void {
    this.#clear.draw(color);
  }

  // noinspection JSUnusedGlobalSymbols
  pixel(xy: Xy, color: SolidColor): void {
    this.#pixel.draw(xy.sub(this.#cameraOffset).round(), color);
  }

  // noinspection JSUnusedGlobalSymbols
  rect(xy1: Xy, xy2: Xy, color: SolidColor): void {
    this.#rect.draw(
      xy1.sub(this.#cameraOffset).round(),
      xy2.sub(this.#cameraOffset).round(),
      color,
      false,
      this.#fillPattern
    );
  }

  // noinspection JSUnusedGlobalSymbols
  rectFilled(xy1: Xy, xy2: Xy, color: SolidColor | CompositeColor): void {
    this.#rect.draw(
      xy1.sub(this.#cameraOffset).round(),
      xy2.sub(this.#cameraOffset).round(),
      color,
      true,
      this.#fillPattern
    );
  }

  // noinspection JSUnusedGlobalSymbols
  ellipse(xy1: Xy, xy2: Xy, color: SolidColor): void {
    this.#ellipse.draw(
      xy1.sub(this.#cameraOffset).round(),
      xy2.sub(this.#cameraOffset).round(),
      color,
      false,
      this.#fillPattern
    );
  }

  // noinspection JSUnusedGlobalSymbols
  ellipseFilled(xy1: Xy, xy2: Xy, color: SolidColor): void {
    this.#ellipse.draw(
      xy1.sub(this.#cameraOffset).round(),
      xy2.sub(this.#cameraOffset).round(),
      color,
      true,
      this.#fillPattern
    );
  }

  // TODO: make sprite make use of fillPattern as well, same as rect and ellipse etc.
  // noinspection JSUnusedGlobalSymbols
  sprite(spriteImageUrl: ImageUrl, sprite: Sprite, canvasXy1: Xy): void {
    const sourceImageAsset = this.#assets.getImage(spriteImageUrl);
    this.#sprite.draw(
      sourceImageAsset,
      sprite,
      canvasXy1.sub(this.#cameraOffset).round(),
      this.#spriteColorMapping
    );
  }

  // TODO: cover with tests
  print(text: string, canvasXy1: Xy, color: SolidColor): void {
    if (this.#fontAsset) {
      this.#text.draw(
        text,
        canvasXy1.sub(this.#cameraOffset).round(),
        this.#fontAsset,
        color
      );
    } else {
      console.info(
        `print: (${canvasXy1.x},${
          canvasXy1.y
        }) [${color.asRgbCssHex()}] ${text}`
      );
    }
  }
}
