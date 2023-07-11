import { SolidColor } from "../Color.ts";
import { Xy } from "../Xy.ts";
import { DrawPixel } from "./DrawPixel.ts";

// TODO: rename to DrawRect and provide a way to draw both filled and not filled rects
export class DrawRect {
  readonly #canvasBytes: Uint8ClampedArray;
  readonly #canvasSize: Xy;

  readonly #pixel: DrawPixel;

  constructor(canvasBytes: Uint8ClampedArray, canvasSize: Xy) {
    this.#canvasBytes = canvasBytes;
    this.#canvasSize = canvasSize;

    this.#pixel = new DrawPixel(this.#canvasBytes, this.#canvasSize);
  }

  draw(xy1: Xy, xy2: Xy, color: SolidColor, fill: boolean): void {
    Xy.forEachIntXyWithinRectOf(xy1, xy2, fill, (xy) => {
      this.#pixel.draw(xy, color);
    });
  }
}
