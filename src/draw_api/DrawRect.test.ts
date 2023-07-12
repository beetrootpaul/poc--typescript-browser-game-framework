import { describe, test } from "@jest/globals";
import { SolidColor } from "../Color.ts";
import { xy_ } from "../Xy.ts";
import { DrawRect } from "./DrawRect.ts";
import { TestCanvas } from "./TestCanvas.ts";

// TODO: tests for fill pattern

describe("DrawRect", () => {
  const c0 = SolidColor.fromRgbCssHex("#010203");
  const c1 = SolidColor.fromRgbCssHex("#111213");

  describe("regular", () => {
    test("simple 1x1", () => {
      // given
      const canvas = new TestCanvas(3, 3, c0);
      const rectFilled = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(1, 1);
      rectFilled.draw(xy1, xy1.add(1), c1, false);

      //then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
        ---
        -#-
        ---
      `,
      });
    });

    test("simple 4x3", () => {
      // given
      const canvas = new TestCanvas(6, 5, c0);
      const rectFilled = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(1, 1);
      rectFilled.draw(xy1, xy1.add(xy_(4, 3)), c1, false);

      //then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
        ------
        -####-
        -#--#-
        -####-
        ------
      `,
      });
    });

    test("drawing on very edges of a canvas", () => {
      // given
      const canvas = new TestCanvas(4, 3, c0);
      const rectFilled = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(0, 0);
      rectFilled.draw(xy1, xy1.add(xy_(4, 3)), c1, false);

      //then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
        ####
        #--#
        ####
      `,
      });
    });

    test("0-size", () => {
      // given
      const canvas = new TestCanvas(3, 3, c0);
      const rectFilled = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(1, 1);
      rectFilled.draw(xy1, xy1, c1, false);

      //then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
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
      const rectFilled = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(-1, -1);
      rectFilled.draw(xy1, xy1.add(3), c1, false);

      //then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
        -#-
        ##-
        ---
      `,
      });
    });

    test("negative size", () => {
      // given
      const canvas = new TestCanvas(6, 5, c0);
      const rectFilled = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(5, 4);
      rectFilled.draw(xy1, xy1.add(xy_(-4, -3)), c1, false);

      //then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
        ------
        -####-
        -#--#-
        -####-
        ------
      `,
      });
    });

    test("clipping: over the left edge", () => {
      // given
      const canvas = new TestCanvas(6, 6, c0);
      const rectFilled = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(-2, 1);
      rectFilled.draw(xy1, xy1.add(xy_(4, 4)), c1, false);

      //then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
        ------
        ##----
        -#----
        -#----
        ##----
        ------
      `,
      });
    });

    test("clipping: over the right edge", () => {
      // given
      const canvas = new TestCanvas(6, 6, c0);
      const rectFilled = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(4, 1);
      rectFilled.draw(xy1, xy1.add(xy_(4, 4)), c1, false);

      //then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
        ------
        ----##
        ----#-
        ----#-
        ----##
        ------
      `,
      });
    });

    test("clipping: over the top edge", () => {
      // given
      const canvas = new TestCanvas(6, 6, c0);
      const rectFilled = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(1, -2);
      rectFilled.draw(xy1, xy1.add(xy_(4, 4)), c1, false);

      //then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
        -#--#-
        -####-
        ------
        ------
        ------
        ------
      `,
      });
    });

    test("clipping: over the bottom edge", () => {
      // given
      const canvas = new TestCanvas(6, 6, c0);
      const rectFilled = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(1, 4);
      rectFilled.draw(xy1, xy1.add(xy_(4, 4)), c1, false);

      //then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
        ------
        ------
        ------
        ------
        -####-
        -#--#-
      `,
      });
    });
  });

  describe("filled", () => {
    test("simple 1x1", () => {
      // given
      const canvas = new TestCanvas(3, 3, c0);
      const rectFilled = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(1, 1);
      rectFilled.draw(xy1, xy1.add(1), c1, true);

      //then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
        ---
        -#-
        ---
      `,
      });
    });

    test("simple 4x3", () => {
      // given
      const canvas = new TestCanvas(6, 5, c0);
      const rectFilled = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(1, 1);
      rectFilled.draw(xy1, xy1.add(xy_(4, 3)), c1, true);

      //then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
        ------
        -####-
        -####-
        -####-
        ------
      `,
      });
    });

    test("drawing on very edges of a canvas", () => {
      // given
      const canvas = new TestCanvas(4, 3, c0);
      const rectFilled = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(0, 0);
      rectFilled.draw(xy1, xy1.add(xy_(4, 3)), c1, true);

      //then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
        ####
        ####
        ####
      `,
      });
    });

    test("0-size", () => {
      // given
      const canvas = new TestCanvas(3, 3, c0);
      const rectFilled = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(1, 1);
      rectFilled.draw(xy1, xy1, c1, true);

      //then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
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
      const rectFilled = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(-1, -1);
      rectFilled.draw(xy1, xy1.add(3), c1, true);

      //then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
        ##-
        ##-
        ---
      `,
      });
    });

    test("negative size", () => {
      // given
      const canvas = new TestCanvas(6, 5, c0);
      const rectFilled = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(5, 4);
      rectFilled.draw(xy1, xy1.add(xy_(-4, -3)), c1, true);

      //then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
        ------
        -####-
        -####-
        -####-
        ------
      `,
      });
    });

    test("clipping: over the left edge", () => {
      // given
      const canvas = new TestCanvas(6, 6, c0);
      const rectFilled = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(-2, 1);
      rectFilled.draw(xy1, xy1.add(xy_(4, 4)), c1, true);

      //then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
        ------
        ##----
        ##----
        ##----
        ##----
        ------
      `,
      });
    });

    test("clipping: over the right edge", () => {
      // given
      const canvas = new TestCanvas(6, 6, c0);
      const rectFilled = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(4, 1);
      rectFilled.draw(xy1, xy1.add(xy_(4, 4)), c1, true);

      //then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
        ------
        ----##
        ----##
        ----##
        ----##
        ------
      `,
      });
    });

    test("clipping: over the top edge", () => {
      // given
      const canvas = new TestCanvas(6, 6, c0);
      const rectFilled = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(1, -2);
      rectFilled.draw(xy1, xy1.add(xy_(4, 4)), c1, true);

      //then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
        -####-
        -####-
        ------
        ------
        ------
        ------
      `,
      });
    });

    test("clipping: over the bottom edge", () => {
      // given
      const canvas = new TestCanvas(6, 6, c0);
      const rectFilled = new DrawRect(canvas.bytes, canvas.size);

      // when
      const xy1 = xy_(1, 4);
      rectFilled.draw(xy1, xy1.add(xy_(4, 4)), c1, true);

      //then
      canvas.expectToEqual({
        withMapping: { "-": c0, "#": c1 },
        expectedImageAsAscii: `
        ------
        ------
        ------
        ------
        -####-
        -####-
      `,
      });
    });
  });
});
