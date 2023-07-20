import { describe, test } from "@jest/globals";
import { SolidColor } from "../Color";
import { xy_ } from "../Xy";
import { DrawPixel } from "./DrawPixel";
import { TestCanvas } from "./TestCanvas";
describe("DrawPixel", () => {
    const c0 = SolidColor.fromRgbCssHex("#010203");
    const c1 = SolidColor.fromRgbCssHex("#111213");
    const c2 = SolidColor.fromRgbCssHex("#212223");
    const c3 = SolidColor.fromRgbCssHex("#313233");
    const c4 = SolidColor.fromRgbCssHex("#414243");
    test("a single pixel", () => {
        // given
        const canvas = new TestCanvas(3, 3, c0);
        const pixel = new DrawPixel(canvas.bytes, canvas.size);
        // when
        const xy1 = xy_(1, 1);
        pixel.draw(xy_(1, 1), c1);
        // then
        canvas.expectToEqual({
            withMapping: { "-": c0, "#": c1 },
            expectedImageAsAscii: `
        - - -
        - # -
        - - -
      `,
        });
    });
    test("canvas' corners", () => {
        // given
        const canvas = new TestCanvas(3, 3, c0);
        const pixel = new DrawPixel(canvas.bytes, canvas.size);
        // when
        pixel.draw(xy_(0, 0), c1);
        pixel.draw(xy_(2, 0), c2);
        pixel.draw(xy_(0, 2), c3);
        pixel.draw(xy_(2, 2), c4);
        // then
        canvas.expectToEqual({
            withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
            expectedImageAsAscii: `
        # - :
        - - -
        % - =
      `,
        });
    });
    test("outside canvas", () => {
        // given
        const canvas = new TestCanvas(3, 3, c0);
        const pixel = new DrawPixel(canvas.bytes, canvas.size);
        // when
        pixel.draw(xy_(-1, 1), c1);
        pixel.draw(xy_(3, 1), c1);
        pixel.draw(xy_(1, -1), c1);
        pixel.draw(xy_(1, 3), c1);
        // then
        canvas.expectToEqual({
            withMapping: { "-": c0, "#": c1 },
            expectedImageAsAscii: `
        - - -
        - - -
        - - -
      `,
        });
    });
});
