import { SolidColor } from "../Color.ts";
import { Xy } from "../Xy.ts";

// TODO: rename to DrawRect and provide a way to draw both filled and not filled rects
export class DrawRectFilled {
  readonly #canvasBytes: Uint8ClampedArray;
  readonly #canvasSize: Xy;

  constructor(canvasBytes: Uint8ClampedArray, canvasSize: Xy) {
    this.#canvasBytes = canvasBytes;
    this.#canvasSize = canvasSize;
  }

  draw(xy1: Xy, xy2: Xy, color: SolidColor): void {
    xy1 = xy1.clamp(Xy.zero, this.#canvasSize);
    xy2 = xy2.clamp(Xy.zero, this.#canvasSize);
    Xy.forEachIntXyWithinRectOf(xy1, xy2, (xy) => {
      const i = 4 * (xy.y * this.#canvasSize.x + xy.x);
      this.#canvasBytes[i] = color.r;
      this.#canvasBytes[i + 1] = color.g;
      this.#canvasBytes[i + 2] = color.b;
      this.#canvasBytes[i + 3] = 0xff;
    });
  }
}
