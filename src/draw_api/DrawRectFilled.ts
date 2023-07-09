import { SolidColor } from "../Color.ts";
import { Xy, xy_ } from "../Xy.ts";
import { DrawPixelFn } from "./DrawApi.ts";

export class DrawRectFilled {
  readonly #drawPixel: DrawPixelFn;

  constructor(drawPixel: DrawPixelFn) {
    this.#drawPixel = drawPixel;
  }

  draw(xy1: Xy, xy2: Xy, c: SolidColor): void {
    const xy1Int = xy1.round();
    const xy2Int = xy2.round();
    // TODO: Xy helper for iterating between xy1 and xy2, while operating on a Xy instance
    for (let y = xy1Int.y; y < xy2Int.y; y += 1) {
      for (let x = xy1Int.x; x < xy2Int.x; x += 1) {
        this.#drawPixel(xy_(x, y), c);
      }
    }
  }
}
