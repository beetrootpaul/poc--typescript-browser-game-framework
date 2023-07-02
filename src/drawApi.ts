import { Color } from "./color.ts";
import { Xy } from "./xy.ts";

export class DrawApi {
  readonly #canvasSize: Xy;
  readonly #canvasRgbaBytes: Uint8ClampedArray;

  constructor(canvasSize: Xy, canvasRgbaBytes: Uint8ClampedArray) {
    this.#canvasSize = canvasSize;
    this.#canvasRgbaBytes = canvasRgbaBytes;
  }

  clear(color: Color) {
    for (let pixels = 0; pixels < this.#canvasRgbaBytes.length / 4; pixels++) {
      const i = pixels * 4;
      this.#canvasRgbaBytes[i] = color.r;
      this.#canvasRgbaBytes[i + 1] = color.g;
      this.#canvasRgbaBytes[i + 2] = color.b;
      this.#canvasRgbaBytes[i + 3] = 255;
    }
  }

  // TODO: remove this temporary method
  drawSomething(pos = 0, color: Color, imgBytes: Uint8Array, imgW: number) {
    const pxLen = this.#canvasRgbaBytes.length / 4;

    this.#canvasRgbaBytes[0] = 0;
    this.#canvasRgbaBytes[1] = 0;
    this.#canvasRgbaBytes[2] = 255;
    this.#canvasRgbaBytes[3] = 255;

    this.#canvasRgbaBytes[(pxLen - 1) * 4] = 0;
    this.#canvasRgbaBytes[(pxLen - 1) * 4 + 1] = 255;
    this.#canvasRgbaBytes[(pxLen - 1) * 4 + 2] = 0;
    this.#canvasRgbaBytes[(pxLen - 1) * 4 + 3] = 255;

    const ii = [
      pos,
      pos + 1,
      pos + 2,
      pos + this.#canvasSize.x,
      pos + this.#canvasSize.x + 2,
      pos + 2 * this.#canvasSize.x,
      pos + 2 * this.#canvasSize.x + 1,
      pos + 2 * this.#canvasSize.x + 2,
    ].map((i) => i * 4);
    ii.forEach((i) => {
      this.#canvasRgbaBytes[i] = color.r;
      this.#canvasRgbaBytes[i + 1] = color.g;
      this.#canvasRgbaBytes[i + 2] = color.b;
      this.#canvasRgbaBytes[i + 3] = 255;
    });

    // TODO: refactor
    for (let px = 0; px < imgBytes.length / 4; px++) {
      const offset = pos * 4 + Math.floor(px / imgW) * this.#canvasSize.x * 4;
      const target = offset + (px % imgW) * 4;
      const idx = px * 4;
      if (imgBytes[idx + 3] > 127) {
        this.#canvasRgbaBytes[target] = imgBytes[idx];
        this.#canvasRgbaBytes[target + 1] = imgBytes[idx + 1];
        this.#canvasRgbaBytes[target + 2] = imgBytes[idx + 2];
        this.#canvasRgbaBytes[target + 3] = 255;
      }
    }
  }
}
