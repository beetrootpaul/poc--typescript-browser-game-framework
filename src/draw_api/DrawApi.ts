import { Assets } from "../Assets.ts";
import { Color, SolidColor } from "../Color.ts";
import { Sprite } from "../Sprite.ts";
import { Xy, xy_ } from "../Xy.ts";
import { DrawClear } from "./DrawClear.ts";
import { DrawEllipse } from "./DrawEllipse.ts";
import { DrawPixel } from "./DrawPixel.ts";
import { DrawRect } from "./DrawRect.ts";
import { DrawSprite } from "./DrawSprite.ts";

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
  readonly #rectFilled: DrawRect;
  readonly #ellipse: DrawEllipse;
  readonly #sprite: DrawSprite;

  #cameraOffset: Xy = xy_(0, 0);

  // RGBA hex representation of a Color is used as this map's keys, because it makes it easier to retrieve mappings with use of string equality
  readonly #spriteColorMapping: Map<string, Color> = new Map();

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
    this.#rectFilled = new DrawRect(
      options.canvasBytes,
      options.canvasSize.round()
    );
    this.#ellipse = new DrawEllipse(
      options.canvasBytes,
      options.canvasSize.round()
    );
    this.#sprite = new DrawSprite(
      options.canvasBytes,
      options.canvasSize.round()
    );
  }

  // TODO: cover it with tests
  // noinspection JSUnusedGlobalSymbols
  setCameraOffset(offset: Xy): void {
    this.#cameraOffset = offset.round();
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
    this.#rectFilled.draw(
      xy1.sub(this.#cameraOffset).round(),
      xy2.sub(this.#cameraOffset).round(),
      color,
      false
    );
  }

  // noinspection JSUnusedGlobalSymbols
  rectFilled(xy1: Xy, xy2: Xy, color: SolidColor): void {
    this.#rectFilled.draw(
      xy1.sub(this.#cameraOffset).round(),
      xy2.sub(this.#cameraOffset).round(),
      color,
      true
    );
  }

  // noinspection JSUnusedGlobalSymbols
  ellipse(xy1: Xy, xy2: Xy, color: SolidColor): void {
    this.#ellipse.draw(
      xy1.sub(this.#cameraOffset).round(),
      xy2.sub(this.#cameraOffset).round(),
      color,
      false
    );
  }

  // noinspection JSUnusedGlobalSymbols
  ellipseFilled(xy1: Xy, xy2: Xy, color: SolidColor): void {
    this.#ellipse.draw(
      xy1.sub(this.#cameraOffset).round(),
      xy2.sub(this.#cameraOffset).round(),
      color,
      true
    );
  }

  // TODO: cover it with tests
  // noinspection JSUnusedGlobalSymbols
  mapSpriteColor(from: Color, to: Color): void {
    // TODO: consider writing a custom equality check function
    if (from.asRgbaCssHex() === to.asRgbaCssHex()) {
      this.#spriteColorMapping.delete(from.asRgbaCssHex());
    } else {
      this.#spriteColorMapping.set(from.asRgbaCssHex(), to);
    }
  }

  // noinspection JSUnusedGlobalSymbols
  sprite(spriteImageUrl: string, sprite: Sprite, targetXy1: Xy): void {
    const sourceImageAsset = this.#assets.getImage(spriteImageUrl);
    this.#sprite.draw(
      sourceImageAsset,
      sprite,
      targetXy1.sub(this.#cameraOffset).round(),
      this.#spriteColorMapping
    );
  }
}
