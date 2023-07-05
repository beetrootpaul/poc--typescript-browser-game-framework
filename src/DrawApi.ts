import { Color } from "./Color.ts";
import { Xy, xy_ } from "./Xy.ts";

// `b` in loops in this file stands for a byte (index)

export class DrawApi {
  readonly #canvasSize: Xy;
  readonly #canvasRgbaBytes: Uint8ClampedArray;

  #cameraOffset: Xy = xy_(0, 0);

  constructor(canvasSize: Xy, canvasRgbaBytes: Uint8ClampedArray) {
    this.#canvasSize = canvasSize.round();
    this.#canvasRgbaBytes = canvasRgbaBytes;
  }

  // TODO: cover it with tests
  setCameraOffset(offset: Xy): void {
    this.#cameraOffset = offset.round();
  }

  // TODO: cover it with tests
  clear(color: Color): void {
    for (let pixel = 0; pixel < this.#canvasRgbaBytes.length / 4; pixel += 1) {
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
    const canvasXy = xy.sub(this.#cameraOffset).round();
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
    const xy1Int = xy1.round();
    const xy2Int = xy2.round();
    for (let y = xy1Int.y; y < xy2Int.y; y += 1) {
      for (let x = xy1Int.x; x < xy2Int.x; x += 1) {
        this.setPixel(xy_(x, y), c);
      }
    }
  }

  // TODO: remove this temporary method
  drawSomething(
    imgBytes: Uint8Array,
    imgW: number,
    imgType: "rgb" | "rgba"
  ): void {
    const imgBytesPerColor = imgType === "rgb" ? 3 : 4;
    for (let px = 0; px < imgBytes.length / imgBytesPerColor; px += 1) {
      const offset = Math.floor(px / imgW) * this.#canvasSize.x * 4;
      const target = offset + (px % imgW) * 4;
      const idx = px * imgBytesPerColor;
      if (imgType === "rgb" || imgBytes[idx + 3] > 127) {
        this.#canvasRgbaBytes[target] = imgBytes[idx];
        this.#canvasRgbaBytes[target + 1] = imgBytes[idx + 1];
        this.#canvasRgbaBytes[target + 2] = imgBytes[idx + 2];
        this.#canvasRgbaBytes[target + 3] = 255;
      }
    }
  }
}
