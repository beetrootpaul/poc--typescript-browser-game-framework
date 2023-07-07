export interface Color {
  // TODO: really needed in a common interface? Or we can use another way to, for example, identify colors in mappings?
  asRgbaCssHex(): string;
}

export class TransparentColor implements Color {
  asRgbaCssHex(): string {
    return "#00000000";
  }
}

export const transparent = new TransparentColor();

// Red, green, and blue, each one as value between 0 and 255.
export class SolidColor implements Color {
  readonly r: number;
  readonly g: number;
  readonly b: number;

  constructor(r: number, g: number, b: number) {
    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
      throw Error(
        `One of color components is outside 0-255 range: r=${r}, g=${g}, b=${b}.`
      );
    }
    this.r = r;
    this.g = g;
    this.b = b;
  }

  asRgbaCssHex(): string {
    return this.asRgbCssHex() + "ff";
  }

  // TODO: still used?
  asRgbCssHex(): string {
    return (
      "#" +
      this.r.toString(16).padStart(2, "0") +
      this.g.toString(16).padStart(2, "0") +
      this.b.toString(16).padStart(2, "0")
    );
  }

  static fromRgbCssHex(cssHex: string): SolidColor {
    if (!/^#[0-9a-fA-F]{6}$/.test(cssHex)) {
      throw Error(
        "Hexadecimal representation of the color doesn't contain exactly 6 hexadecimal digits, preceded by a single '#'"
      );
    }
    return new SolidColor(
      parseInt(cssHex.slice(1, 3), 16),
      parseInt(cssHex.slice(3, 5), 16),
      parseInt(cssHex.slice(5, 7), 16)
    );
  }
}