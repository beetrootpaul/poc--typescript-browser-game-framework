import { Color, SolidColor } from "./Color.ts";
import { Sprite } from "./Sprite.ts";
import { Xy, xy_ } from "./Xy.ts";

// `b` in loops in this file stands for a byte (index)

export class DrawApi {
  readonly #canvasSize: Xy;
  readonly #canvasRgbaBytes: Uint8ClampedArray;

  #cameraOffset: Xy = xy_(0, 0);

  // Hex representation of a Color is used as this map's keys, because it makes it easier to retrieve mappings with use of string equality
  readonly #spriteColorMapping: Map<string, Color> = new Map();

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
    if (color instanceof SolidColor) {
      for (
        let pixel = 0;
        pixel < this.#canvasRgbaBytes.length / 4;
        pixel += 1
      ) {
        const b = pixel * 4;
        this.#canvasRgbaBytes[b] = color.r;
        this.#canvasRgbaBytes[b + 1] = color.g;
        this.#canvasRgbaBytes[b + 2] = color.b;
        this.#canvasRgbaBytes[b + 3] = 255;
      }
    }
  }

  // TODO: cover it with tests
  // TODO: clipping outside canvas
  // TODO: negative x/y
  pixel(xy: Xy, c: Color): void {
    if (c instanceof SolidColor) {
      const canvasXy = xy.sub(this.#cameraOffset).round();
      let b = (canvasXy.y * this.#canvasSize.x + canvasXy.x) * 4;
      this.#canvasRgbaBytes[b] = c.r;
      this.#canvasRgbaBytes[b + 1] = c.g;
      this.#canvasRgbaBytes[b + 2] = c.b;
      this.#canvasRgbaBytes[b + 3] = 255;
    }
  }

  // TODO: cover it with tests
  // TODO: clipping outside canvas
  // TODO: negative x1/y1
  // TODO: negative w/h
  // TODO: Xy helper for iterating between xy1 and xy2, while operating on a Xy instance
  rectFilled(xy1: Xy, xy2: Xy, c: Color): void {
    if (c instanceof SolidColor) {
      const xy1Int = xy1.round();
      const xy2Int = xy2.round();
      for (let y = xy1Int.y; y < xy2Int.y; y += 1) {
        for (let x = xy1Int.x; x < xy2Int.x; x += 1) {
          this.pixel(xy_(x, y), c);
        }
      }
    }
  }

  // TODO: cover it with tests
  // TODO: maybe pass mapping as param to sprite drawing instead of setting it independently and having to reset it afterwards?
  mapSpriteColor(from: Color, to: Color): void {
    // TODO: consider writing a custom equality check function
    if (from.asRgbaCssHex() === to.asRgbaCssHex()) {
      this.#spriteColorMapping.delete(from.asRgbaCssHex());
    } else {
      this.#spriteColorMapping.set(from.asRgbaCssHex(), to);
    }
  }

  // TODO: REWORK THIS
  // TODO: cover it with tests
  // TODO: make sure the case of sprite.xy2 < sprite.xy1 is handled correctly
  sprite(
    imgBytes: Uint8Array,
    imgW: number,
    imgType: "rgb" | "rgba",
    sprite: Sprite,
    targetXy1: Xy
  ): void {
    const imgBytesPerColor = imgType === "rgb" ? 3 : 4;
    const baseOffset =
      (targetXy1.y - sprite.xy1.y) * this.#canvasSize.x +
      (targetXy1.x - sprite.xy1.x);
    for (let px = 0; px < imgBytes.length / imgBytesPerColor; px += 1) {
      const imgX = px % imgW;
      const imgY = Math.floor(px / imgW);
      if (
        imgX >= sprite.xy1.x &&
        imgX < sprite.xy2.x &&
        imgY >= sprite.xy1.y &&
        imgY < sprite.xy2.y
      ) {
        const offset = baseOffset + imgY * this.#canvasSize.x;
        const target = (offset + imgX) * 4;
        const idx = px * imgBytesPerColor;
        // TODO: how to make it clearer that we simplify transparency here to below and above 127?
        if (imgType === "rgb" || imgBytes[idx + 3] > 127) {
          // TODO: refactor?
          let c: Color = new SolidColor(
            imgBytes[idx],
            imgBytes[idx + 1],
            imgBytes[idx + 2]
          );
          c = this.#spriteColorMapping.get(c.asRgbaCssHex()) ?? c;
          if (c instanceof SolidColor) {
            // TODO: consider reusing this.setPixel(…)
            const adjustedTarget =
              target -
              (this.#cameraOffset.y * this.#canvasSize.x +
                this.#cameraOffset.x) *
                4;
            this.#canvasRgbaBytes[adjustedTarget] = c.r;
            this.#canvasRgbaBytes[adjustedTarget + 1] = c.g;
            this.#canvasRgbaBytes[adjustedTarget + 2] = c.b;
            this.#canvasRgbaBytes[adjustedTarget + 3] = 255;
          }
        }
      }
    }
  }
}
