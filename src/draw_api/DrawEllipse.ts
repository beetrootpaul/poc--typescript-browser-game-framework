import { SolidColor } from "../Color.ts";
import { Xy, xy_ } from "../Xy.ts";
import { DrawPixel } from "./DrawPixel.ts";

export class DrawEllipse {
  readonly #canvasBytes: Uint8ClampedArray;
  readonly #canvasSize: Xy;

  readonly #pixel: DrawPixel;

  constructor(canvasBytes: Uint8ClampedArray, canvasSize: Xy) {
    this.#canvasBytes = canvasBytes;
    this.#canvasSize = canvasSize;

    this.#pixel = new DrawPixel(this.#canvasBytes, this.#canvasSize);
  }

  // Based on https://github.com/aseprite/aseprite/blob/25fbe786f8353a2ddb57de3bcc5db00066cc9ca6/src/doc/algo.cpp#L216-L315
  draw(xy1: Xy, xy2: Xy, color: SolidColor, fill: boolean): void {
    let x0 = xy1.x;
    let x1 = xy2.x - 1;
    let y0 = xy1.y;
    let y1 = xy2.y - 1;
    const h = y1 - y0 + 1;

    // diameter
    let a = Math.abs(x1 - x0);
    let b = Math.abs(y1 - y0);

    let b1 = b & 1;

    // error increments
    let dx = 4 * (1 - a) * b * b;
    let dy = 4 * (b1 + 1) * a * a;

    // error of 1.step
    let err = dx + dy + b1 * a * a;
    let e2;

    y0 += Math.floor((b + 1) / 2);
    // starting pixel
    y1 = y0 - b1;
    a = 8 * a * a;
    b1 = 8 * b * b;

    while (true) {
      if (fill) {
        // Self::draw_horizontal_line(ctx, ivec2(x0, y0), x1 - x0 + 1, color); //  I. & II. Quadrant
        // Self::draw_horizontal_line(ctx, ivec2(x0, y1), x1 - x0 + 1, color);
        //  III. & IV. Quadrant
      } else {
        this.#pixel.draw(xy_(x1, y0), color); //   I. Quadrant
        this.#pixel.draw(xy_(x0, y0), color); //  II. Quadrant
        this.#pixel.draw(xy_(x0, y1), color); // III. Quadrant
        this.#pixel.draw(xy_(x1, y1), color); //  IV. Quadrant
      }

      e2 = 2 * err;
      // y step
      if (e2 <= dy) {
        y0 += 1;
        y1 -= 1;
        dy += a;
        err += dy;
      }
      // x step
      if (e2 >= dx || 2 * err > dy) {
        x0 += 1;
        x1 -= 1;
        dx += b1;
        err += dx;
      }

      if (x0 > x1) {
        break;
      }
    }

    // TODO: cover this with a tests
    while (y0 - y1 < h) {
      // too early stop of flat ellipses a=1
      this.#pixel.draw(xy_(x0 - 1, y0), color);
      this.#pixel.draw(xy_(x1 + 1, y0), color);
      y0 += 1;
      this.#pixel.draw(xy_(x0 - 1, y1), color);
      this.#pixel.draw(xy_(x1 + 1, y1), color);
      y1 -= 1;
    }
  }
}
