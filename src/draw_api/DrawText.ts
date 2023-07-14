import { FontAsset } from "../Assets.ts";
import { SolidColor, transparent } from "../Color.ts";
import { Xy } from "../Xy.ts";
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

  // TODO: tests, especially to check that we iterate over emojis like "➡️" correctly
  draw(
    text: string,
    canvasXy1: Xy,
    fontAsset: FontAsset,
    color: SolidColor
  ): void {
    for (const charSprite of fontAsset.font.spritesFor(text)) {
      this.#sprite.draw(
        fontAsset.image,
        charSprite.sprite,
        canvasXy1.add(charSprite.positionInText),
        new Map([
          [fontAsset.imageTextColor.id(), color],
          [fontAsset.imageBgColor.id(), transparent],
        ])
      );
    }
  }
}
