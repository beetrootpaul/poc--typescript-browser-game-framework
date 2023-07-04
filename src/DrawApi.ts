import { Color } from "./Color.ts";
import { Xy, xy_ } from "./Xy.ts";

// `b` in loops in this file stands for a byte (index)

export class DrawApi {
  readonly #canvasSize: Xy;
  readonly #canvasRgbaBytes: Uint8ClampedArray;

  #cameraOffset: Xy = xy_(0, 0);

  constructor(canvasSize: Xy, canvasRgbaBytes: Uint8ClampedArray) {
    this.#canvasSize = canvasSize;
    this.#canvasRgbaBytes = canvasRgbaBytes;
  }

  setCameraOffset(offset: Xy): void {
    this.#cameraOffset = offset;
  }

  clear(color: Color): void {
    for (let pixel = 0; pixel < this.#canvasRgbaBytes.length / 4; pixel++) {
      const b = pixel * 4;
      this.#canvasRgbaBytes[b] = color.r;
      this.#canvasRgbaBytes[b + 1] = color.g;
      this.#canvasRgbaBytes[b + 2] = color.b;
      this.#canvasRgbaBytes[b + 3] = 255;
    }
  }

  // TODO: cover it with tests
  // TODO: clipping outside canvas
  // TODO: negative x/y
  setPixel(xy: Xy, c: Color): void {
    const canvasXy = xy.sub(this.#cameraOffset);
    let b = (canvasXy.y * this.#canvasSize.x + canvasXy.x) * 4;
    this.#canvasRgbaBytes[b] = c.r;
    this.#canvasRgbaBytes[b + 1] = c.g;
    this.#canvasRgbaBytes[b + 2] = c.b;
    this.#canvasRgbaBytes[b + 3] = 255;
  }

  // TODO: cover it with tests
  // TODO: clipping outside canvas
  // TODO: negative x1/y1
  // TODO: negative w/h
  // TODO: Xy helper for iterating between xy1 and xy2, while operating on a Xy instance
  drawRectFilled(xy1: Xy, xy2: Xy, c: Color): void {
    for (let y = xy1.y; y < xy2.y; ++y) {
      for (let x = xy1.x; x < xy2.x; ++x) {
        this.setPixel(xy_(x, y), c);
      }
    }
  }

  // TODO: remove this temporary method
  drawSomething(
    pos = 0,
    color: Color,
    imgBytes: Uint8Array,
    imgW: number
  ): void {
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
