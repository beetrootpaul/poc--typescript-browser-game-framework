import { FontAsset } from "../Assets.ts";
import { SolidColor } from "../Color.ts";
import { Xy, xy_ } from "../Xy.ts";
import { DrawSprite } from "./DrawSprite.ts";

export class DrawText {
  readonly #canvasBytes: Uint8ClampedArray;
  readonly #canvasSize: Xy;

  readonly #sprite: DrawSprite;

  constructor(canvasBytes: Uint8ClampedArray, canvasSize: Xy) {
    this.#canvasBytes = canvasBytes;
    this.#canvasSize = canvasSize;

    this.#sprite = new DrawSprite(this.#canvasBytes, this.#canvasSize);
  }

  // TODO: tests
  draw(
    text: string,
    canvasXy1: Xy,
    fontAsset: FontAsset,
    // TODO: use this param
    color: SolidColor
  ): void {
    let xy = canvasXy1;
    for (let i = 0; i < text.length; i += 1) {
      const sprite = fontAsset.font.spriteFor(text[i]!);
      if (sprite) {
        this.#sprite.draw(fontAsset.image, sprite, xy);
        xy = xy.add(xy_(sprite.w + fontAsset.font.letterSpacingW, 0));
      } else {
        xy = xy.add(
          xy_(fontAsset.font.spaceCharW + fontAsset.font.letterSpacingW, 0)
        );
      }
    }
  }
}
