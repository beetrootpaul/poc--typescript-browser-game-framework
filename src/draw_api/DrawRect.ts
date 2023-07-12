import { CompositeColor, SolidColor } from "../Color.ts";
import { Xy } from "../Xy.ts";
import { DrawPixel } from "./DrawPixel.ts";
import { FillPattern } from "./FillPattern.ts";

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

  draw(
    xy1: Xy,
    xy2: Xy,
    color: SolidColor | CompositeColor,
    fill: boolean,
    fillPattern: FillPattern = FillPattern.primaryOnly
  ): void {
    Xy.forEachIntXyWithinRectOf(xy1, xy2, fill, (xy) => {
      // TODO: update the implementation below to honor fill pattern
      if (color instanceof CompositeColor) {
        if (color.primary instanceof SolidColor) {
          this.#pixel.draw(xy, color.primary);
        }
      } else {
        this.#pixel.draw(xy, color);
      }
    });
  }
}
