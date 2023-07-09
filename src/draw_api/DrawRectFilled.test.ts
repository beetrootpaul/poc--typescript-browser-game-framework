import { describe, test } from "@jest/globals";
import { SolidColor } from "../Color.ts";
import { xy_ } from "../Xy.ts";
import { DrawRectFilled } from "./DrawRectFilled.ts";
import { TestCanvas } from "./TestCanvas.ts";

describe("DrawRectFilled", () => {
  const c0 = "#000000";
  const c1 = "#000001";

  test("simple 1x1", () => {
    // given
    const canvas = new TestCanvas(3, 3, c0);
    const rectFilled = new DrawRectFilled(canvas.setPx.bind(canvas));

    // when
    const xy1 = xy_(1, 1);
    rectFilled.draw(xy1, xy1.add(1), SolidColor.fromRgbCssHex(c1));

    //then
    canvas.expectToEqual({
      withMapping: { [c0]: "-", [c1]: "#" },
      expectedImageAsAscii: `
        ---
        -#-
        ---
      `,
    });
  });

  test("simple 3x2", () => {
    // given
    const canvas = new TestCanvas(5, 4, c0);
    const rectFilled = new DrawRectFilled(canvas.setPx.bind(canvas));

    // when
    const xy1 = xy_(1, 1);
    rectFilled.draw(xy1, xy1.add(xy_(3, 2)), SolidColor.fromRgbCssHex(c1));

    //then
    canvas.expectToEqual({
      withMapping: { [c0]: "-", [c1]: "#" },
      expectedImageAsAscii: `
        -----
        -###-
        -###-
        -----
      `,
    });
  });

  test("drawing on very edges of a canvas", () => {
    // given
    const canvas = new TestCanvas(3, 2, c0);
    const rectFilled = new DrawRectFilled(canvas.setPx.bind(canvas));

    // when
    const xy1 = xy_(0, 0);
    rectFilled.draw(xy1, xy1.add(xy_(3, 2)), SolidColor.fromRgbCssHex(c1));

    //then
    canvas.expectToEqual({
      withMapping: { [c0]: "-", [c1]: "#" },
      expectedImageAsAscii: `
        ###
        ###
      `,
    });
  });

  test("0-size", () => {
    // given
    const canvas = new TestCanvas(3, 3, c0);
    const rectFilled = new DrawRectFilled(canvas.setPx.bind(canvas));

    // when
    const xy1 = xy_(1, 1);
    rectFilled.draw(xy1, xy1, SolidColor.fromRgbCssHex(c1));

    //then
    canvas.expectToEqual({
      withMapping: { [c0]: "-", [c1]: "#" },
      expectedImageAsAscii: `
        ---
        ---
        ---
      `,
    });
  });

  test("negative left-top corner", () => {
    // given
    const canvas = new TestCanvas(3, 3, c0);
    const rectFilled = new DrawRectFilled(canvas.setPx.bind(canvas));

    // when
    const xy1 = xy_(-1, -1);
    rectFilled.draw(xy1, xy1.add(2), SolidColor.fromRgbCssHex(c1));

    //then
    canvas.expectToEqual({
      withMapping: { [c0]: "-", [c1]: "#" },
      expectedImageAsAscii: `
        #--
        ---
        ---
      `,
    });
  });

  test("negative size", () => {
    // given
    const canvas = new TestCanvas(5, 4, c0);
    const rectFilled = new DrawRectFilled(canvas.setPx.bind(canvas));

    // when
    const xy1 = xy_(4, 3);
    rectFilled.draw(xy1, xy1.add(xy_(-3, -2)), SolidColor.fromRgbCssHex(c1));

    //then
    canvas.expectToEqual({
      withMapping: { [c0]: "-", [c1]: "#" },
      expectedImageAsAscii: `
        -----
        -###-
        -###-
        -----
      `,
    });
  });
});
