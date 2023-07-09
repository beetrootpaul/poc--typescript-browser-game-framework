import { SolidColor } from "../Color.ts";
import { Xy } from "../Xy.ts";
import { DrawPixelFn } from "./DrawApi.ts";

export class DrawRectFilled {
  readonly #drawPixel: DrawPixelFn;

  constructor(drawPixel: DrawPixelFn) {
    this.#drawPixel = drawPixel;
  }

  draw(xy1: Xy, xy2: Xy, c: SolidColor): void {
    Xy.forEachIntXyBetween(xy1, xy2, (xy) => {
      this.#drawPixel(xy, c);
    });
  }
}
