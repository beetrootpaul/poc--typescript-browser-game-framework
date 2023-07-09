import { expect } from "@jest/globals";
import { type Color } from "../Color.ts";
import { Xy } from "../Xy.ts";

export class TestCanvas {
  readonly #pixels: string[][];

  constructor(width: number, height: number, defaultColorRgbCssHex: string) {
    this.#pixels = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => toSolidRgba(defaultColorRgbCssHex))
    );
  }

  setPx(xy: Xy, c: Color) {
    if (
      xy.y < 0 ||
      xy.y >= this.#pixels.length ||
      xy.x < 0 ||
      xy.x >= this.#pixels[0].length
    ) {
      // do nothing, since we assume the `DrawApi#pixel` used on production performs clipping on its own
      return;
    }
    this.#pixels[xy.y][xy.x] = c.asRgbaCssHex();
  }

  expectToEqual(params: {
    withMapping: Record<string, string>;
    expectedImageAsAscii: string;
  }) {
    const actualAscii = this.#asAscii(params.withMapping);
    const expectedAscii =
      params.expectedImageAsAscii
        .trim()
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .join("\n") + "\n";
    expect(actualAscii).toEqual(expectedAscii);
  }

  #asAscii(rgbCssHexToAscii: Record<string, string>): string {
    const rgbaCssHexToAscii: Map<string, string> = new Map(
      Object.entries(rgbCssHexToAscii).map(([rgb, ascii]) => [
        toSolidRgba(rgb),
        ascii,
      ])
    );
    return this.#pixels.reduce((asciiImage, pixelsRow) => {
      const asciiRow = pixelsRow.reduce((asciiRow, rgba) => {
        const asciiPixel = rgbaCssHexToAscii.get(rgba) ?? "?";
        return asciiRow + asciiPixel;
      }, "");
      return asciiImage + asciiRow + "\n";
    }, "");
  }
}

// TODO: sounds like something that should be a util fn of Color or SolidColor
function toSolidRgba(rgbCssHex: string): string {
  return rgbCssHex + "ff";
}
