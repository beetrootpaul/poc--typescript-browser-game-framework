import { ImageAsset } from "../Assets.ts";
import { type Color, SolidColor, transparent } from "../Color.ts";
import { Sprite } from "../Sprite.ts";
import { Xy, xy_ } from "../Xy.ts";
import { DrawPixel } from "./DrawPixel.ts";

export class DrawSprite {
  readonly #canvasBytes: Uint8ClampedArray;
  readonly #canvasSize: Xy;

  readonly #pixel: DrawPixel;

  constructor(canvasBytes: Uint8ClampedArray, canvasSize: Xy) {
    this.#canvasBytes = canvasBytes;
    this.#canvasSize = canvasSize;

    this.#pixel = new DrawPixel(this.#canvasBytes, this.#canvasSize);
  }

  draw(
    sourceImageAsset: ImageAsset,
    sprite: Sprite,
    targetXy1: Xy,
    // RGBA hex representation of a Color is used as this map's keys, because it makes it easier to retrieve mappings with use of string equality
    colorMapping: Map<string, Color>
  ): void {
    const {
      width: imgW,
      height: imgH,
      rgba8bitData: imgBytes,
    } = sourceImageAsset;

    // make sure xy1 is top-left and xy2 is bottom right
    sprite = {
      xy1: xy_(
        Math.min(sprite.xy1.x, sprite.xy2.x),
        Math.min(sprite.xy1.y, sprite.xy2.y)
      ),
      xy2: xy_(
        Math.max(sprite.xy1.x, sprite.xy2.x),
        Math.max(sprite.xy1.y, sprite.xy2.y)
      ),
    };

    // clip sprite by image edges
    sprite = {
      xy1: sprite.xy1.clamp(Xy.zero, xy_(imgW, imgH)),
      xy2: sprite.xy2.clamp(Xy.zero, xy_(imgW, imgH)),
    };

    for (let imgY = sprite.xy1.y; imgY < sprite.xy2.y; imgY += 1) {
      for (let imgX = sprite.xy1.x; imgX < sprite.xy2.x; imgX += 1) {
        const imgBytesIndex = (imgY * imgW + imgX) * 4;

        if (imgBytes.length < imgBytesIndex + 4) {
          throw Error(
            `DrawSprite: there are less image bytes (${imgBytes.length}) than accessed byte index (${imgBytesIndex})`
          );
        }
        let color =
          imgBytes[imgBytesIndex + 3]! > 0xff / 2
            ? new SolidColor(
                imgBytes[imgBytesIndex]!,
                imgBytes[imgBytesIndex + 1]!,
                imgBytes[imgBytesIndex + 2]!
              )
            : transparent;
        color = colorMapping.get(color.asRgbaCssHex()) ?? color;

        if (color instanceof SolidColor) {
          const canvasXy = targetXy1.add(
            xy_(imgX - sprite.xy1.x, imgY - sprite.xy1.y)
          );
          this.#pixel.draw(canvasXy, color);
        }
      }
    }
  }
}
