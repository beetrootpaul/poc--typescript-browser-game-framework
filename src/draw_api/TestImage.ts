import { ImageAsset } from "../Assets.ts";
import { type Color, SolidColor, TransparentColor } from "../Color.ts";

export class TestImage {
  readonly asset: ImageAsset;

  constructor(params: { image: string; withMapping: Record<string, Color> }) {
    const asciiImage = params.image;
    const asciiToColor = params.withMapping;

    const normalizedAsciiImageLines = asciiImage
      .trim()
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    const normalizedAsciiImage = normalizedAsciiImageLines.join("");

    this.asset = {
      width: normalizedAsciiImageLines[0].length,
      height: normalizedAsciiImageLines.length,
      rgba8bitData: new Uint8ClampedArray(4 * normalizedAsciiImage.length),
    };

    for (let i = 0; i < this.asset.width * this.asset.height; i += 1) {
      const color: SolidColor | TransparentColor | undefined =
        asciiToColor[normalizedAsciiImage[i]];
      if (!color) {
        throw Error(
          `TestImage: Missing color mapping for "${normalizedAsciiImage[i]}"`
        );
      } else if (color instanceof SolidColor) {
        this.asset.rgba8bitData[4 * i] = color.r;
        this.asset.rgba8bitData[4 * i + 1] = color.g;
        this.asset.rgba8bitData[4 * i + 2] = color.b;
        this.asset.rgba8bitData[4 * i + 3] = 0xff;
      } else {
        this.asset.rgba8bitData[4 * i] = 0x00;
        this.asset.rgba8bitData[4 * i + 1] = 0x00;
        this.asset.rgba8bitData[4 * i + 2] = 0x00;
        this.asset.rgba8bitData[4 * i + 3] = 0x00;
      }
    }
  }
}
