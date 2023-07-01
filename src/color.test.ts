import { describe, expect, test } from "@jest/globals";
import { Color } from "./color.ts";

describe("Colopr", () => {
  describe("constructor", () => {
    test("successful construction", () => {
      const color = new Color(1, 2, 3);

      expect(color.r).toEqual(1);
      expect(color.g).toEqual(2);
      expect(color.b).toEqual(3);
    });

    test("validation", () => {
      expect(() => new Color(0, -1, 0)).toThrow(
        "One of color components is outside 0-255 range"
      );
      expect(() => new Color(0, 256, 0)).toThrow(
        "One of color components is outside 0-255 range"
      );
    });
  });

  describe("#fromCssHex", () => {
    test("successful conversions", () => {
      expect(Color.fromCssHex("#000000")).toEqual(new Color(0, 0, 0));
      expect(Color.fromCssHex("#010203")).toEqual(new Color(1, 2, 3));
      expect(Color.fromCssHex("#f1f2f3")).toEqual(new Color(241, 242, 243));
      expect(Color.fromCssHex("#ffffff")).toEqual(new Color(255, 255, 255));
    });

    test("normalization", () => {
      expect(Color.fromCssHex("#ABCDEF").asCssHex()).toEqual("#abcdef");
    });

    test("validation", () => {
      expect(() => Color.fromCssHex("#1234567")).toThrow(
        "Hexadecimal representation of the color doesn't contain exactly 6 hexadecimal digits, preceded by a single '#'"
      );
      expect(() => Color.fromCssHex("#12345")).toThrow(
        "Hexadecimal representation of the color doesn't contain exactly 6 hexadecimal digits, preceded by a single '#'"
      );
      expect(() => Color.fromCssHex("#00000g")).toThrow(
        "Hexadecimal representation of the color doesn't contain exactly 6 hexadecimal digits, preceded by a single '#'"
      );
      expect(() => Color.fromCssHex("#00#0000")).toThrow(
        "Hexadecimal representation of the color doesn't contain exactly 6 hexadecimal digits, preceded by a single '#'"
      );
      expect(() => Color.fromCssHex("# 000000")).toThrow(
        "Hexadecimal representation of the color doesn't contain exactly 6 hexadecimal digits, preceded by a single '#'"
      );
    });
  });

  describe("#asCssHex", () => {
    test("successful conversions", () => {
      expect(new Color(0, 0, 0).asCssHex()).toEqual("#000000");
      expect(new Color(1, 2, 3).asCssHex()).toEqual("#010203");
      expect(new Color(241, 242, 243).asCssHex()).toEqual("#f1f2f3");
      expect(new Color(255, 255, 255).asCssHex()).toEqual("#ffffff");
    });
  });
});
