import { Assets } from "../Assets.ts";
import { Color, SolidColor } from "../Color.ts";
import { Sprite } from "../Sprite.ts";
import { Xy, xy_ } from "../Xy.ts";
import { DrawClear } from "./DrawClear.ts";
import { DrawEllipse } from "./DrawEllipse.ts";
import { DrawPixel } from "./DrawPixel.ts";
import { DrawRectFilled } from "./DrawRectFilled.ts";

type DrawApiOptions = {
  // TODO: better name to indicate in-out nature of this param? Or some info in JSDoc?
  canvasBytes: Uint8ClampedArray;
  canvasSize: Xy;
  assets: Assets;
};

export class DrawApi {
  // TODO: still needed as a separate field?
  readonly #canvasBytes: Uint8ClampedArray;
  // TODO: still needed as a separate field?
  readonly #canvasSize: Xy;
  // TODO: still needed as a separate field?
  readonly #assets: Assets;

  readonly #clear: DrawClear;
  readonly #pixel: DrawPixel;
  readonly #rectFilled: DrawRectFilled;
  readonly #ellipse: DrawEllipse;

  #cameraOffset: Xy = xy_(0, 0);

  // Hex representation of a Color is used as this map's keys, because it makes it easier to retrieve mappings with use of string equality
  readonly #spriteColorMapping: Map<string, Color> = new Map();

  constructor(options: DrawApiOptions) {
    this.#canvasBytes = options.canvasBytes;
    this.#canvasSize = options.canvasSize.round();
    this.#assets = options.assets;

    this.#clear = new DrawClear(this.#canvasBytes, this.#canvasSize);
    this.#pixel = new DrawPixel(this.#canvasBytes, this.#canvasSize);
    this.#rectFilled = new DrawRectFilled(this.#canvasBytes, this.#canvasSize);
    this.#ellipse = new DrawEllipse(this.#canvasBytes, this.#canvasSize);
  }

  // TODO: cover it with tests
  setCameraOffset(offset: Xy): void {
    this.#cameraOffset = offset.round();
  }

  clear(color: SolidColor): void {
    this.#clear.draw(color);
  }

  pixel(xy: Xy, color: SolidColor): void {
    this.#pixel.draw(xy.sub(this.#cameraOffset).round(), color);
  }

  rectFilled(xy1: Xy, xy2: Xy, color: SolidColor): void {
    this.#rectFilled.draw(
      xy1.sub(this.#cameraOffset).round(),
      xy2.sub(this.#cameraOffset).round(),
      color
    );
  }

  ellipse(xy1: Xy, xy2: Xy, color: SolidColor): void {
    this.#ellipse.draw(
      xy1.sub(this.#cameraOffset).round(),
      xy2.sub(this.#cameraOffset).round(),
      color,
      false
    );
  }

  ellipseFilled(xy1: Xy, xy2: Xy, color: SolidColor): void {
    this.#ellipse.draw(
      xy1.sub(this.#cameraOffset).round(),
      xy2.sub(this.#cameraOffset).round(),
      color,
      true
    );
  }

  // TODO: cover it with tests
  // TODO: maybe pass mapping as param to sprite drawing instead of setting it independently and having to reset it afterwards?
  mapSpriteColor(from: Color, to: Color): void {
    // TODO: consider writing a custom equality check function
    if (from.asRgbaCssHex() === to.asRgbaCssHex()) {
      this.#spriteColorMapping.delete(from.asRgbaCssHex());
    } else {
      this.#spriteColorMapping.set(from.asRgbaCssHex(), to);
    }
  }

  // TODO: implement clipping of the desired sprite size to the real source image area
  // TODO: cover it with tests
  // TODO: make sure the case of sprite.xy2 < sprite.xy1 is handled correctly
  sprite(spriteImageUrl: string, sprite: Sprite, targetXy1: Xy): void {
    const {
      width: imgW,
      height: imgH,
      rgba8bitData: imgBytes,
    } = this.#assets.getImage(spriteImageUrl);
    const imgBytesPerColor = 4;
    const baseOffset =
      (targetXy1.y - sprite.xy1.y) * this.#canvasSize.x +
      (targetXy1.x - sprite.xy1.x);
    for (let px = 0; px < imgBytes.length / imgBytesPerColor; px += 1) {
      const imgX = px % imgW;
      const imgY = Math.floor(px / imgW);
      if (
        imgX >= sprite.xy1.x &&
        imgX < sprite.xy2.x &&
        imgY >= sprite.xy1.y &&
        imgY < sprite.xy2.y
      ) {
        const offset = baseOffset + imgY * this.#canvasSize.x;
        const target = (offset + imgX) * 4;
        const idx = px * imgBytesPerColor;
        // TODO: how to make it clearer that we simplify transparency here to below and above 127?
        if (imgBytes[idx + 3] > 127) {
          // TODO: refactor?
          let c: Color = new SolidColor(
            imgBytes[idx],
            imgBytes[idx + 1],
            imgBytes[idx + 2]
          );
          c = this.#spriteColorMapping.get(c.asRgbaCssHex()) ?? c;
          if (c instanceof SolidColor) {
            // TODO: consider reusing this.pixel(…)
            const adjustedTarget =
              target -
              (this.#cameraOffset.y * this.#canvasSize.x +
                this.#cameraOffset.x) *
                4;
            this.#canvasBytes[adjustedTarget] = c.r;
            this.#canvasBytes[adjustedTarget + 1] = c.g;
            this.#canvasBytes[adjustedTarget + 2] = c.b;
            this.#canvasBytes[adjustedTarget + 3] = 255;
          }
        }
      }
    }
  }
}
