import { describe, test } from "@jest/globals";
import { SolidColor, transparent } from "../Color.ts";
import { spr_ } from "../Sprite.ts";
import { xy_ } from "../Xy.ts";
import { DrawSprite } from "./DrawSprite.ts";
import { TestCanvas } from "./TestCanvas.ts";
import { TestImage } from "./TestImage.ts";

// TODO: tests for fill pattern

describe("DrawSprite", () => {
  const ct = transparent;
  const c0 = SolidColor.fromRgbCssHex("#010203");
  const c1 = SolidColor.fromRgbCssHex("#111213");
  const c2 = SolidColor.fromRgbCssHex("#212223");
  const c3 = SolidColor.fromRgbCssHex("#313233");
  const c4 = SolidColor.fromRgbCssHex("#414243");
  const c5 = SolidColor.fromRgbCssHex("#515253");

  test("1x1 image", () => {
    // given
    const canvas = new TestCanvas(3, 3, c0);
    const sprite = new DrawSprite(canvas.bytes, canvas.size);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1 },
      image: `
        #
      `,
    });

    // when
    sprite.draw(image.asset, spr_(0, 0, 1, 1), xy_(1, 1), new Map());

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

  test("image with multiple colors", () => {
    // given
    const canvas = new TestCanvas(9, 6, c0);
    const sprite = new DrawSprite(canvas.bytes, canvas.size);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      image: `
        # # # # #
        # : % : =
        = = = = =
      `,
    });

    // when
    sprite.draw(image.asset, spr_(0, 0, 5, 3), xy_(3, 2), new Map());

    // then
    canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      expectedImageAsAscii: `
        - - - - - - - - -
        - - - - - - - - -
        - - - # # # # # -
        - - - # : % : = -
        - - - = = = = = -
        - - - - - - - - -
      `,
    });
  });

  test("a sprite from a bigger image", () => {
    // given
    const canvas = new TestCanvas(5, 4, c0);
    const sprite = new DrawSprite(canvas.bytes, canvas.size);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
    });

    // when
    sprite.draw(image.asset, spr_(1, 1, 3, 3), xy_(2, 1), new Map());

    // then
    canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      expectedImageAsAscii: `
        - - - - -
        - - : = -
        - - % : -
        - - - - -
      `,
    });
  });

  test("a 0-size sprite", () => {
    // given
    const canvas = new TestCanvas(5, 4, c0);
    const sprite = new DrawSprite(canvas.bytes, canvas.size);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
    });

    // when
    sprite.draw(image.asset, spr_(1, 1, 1, 1), xy_(2, 1), new Map());

    // then
    canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      expectedImageAsAscii: `
        - - - - -
        - - - - -
        - - - - -
        - - - - -
      `,
    });
  });

  test("a negative size sprite", () => {
    // given
    const canvas = new TestCanvas(5, 4, c0);
    const sprite = new DrawSprite(canvas.bytes, canvas.size);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
    });

    // when
    sprite.draw(image.asset, spr_(3, 3, 1, 1), xy_(2, 1), new Map());

    // then
    canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      expectedImageAsAscii: `
        - - - - -
        - - : = -
        - - % : -
        - - - - -
      `,
    });
  });

  test("sprite vs source image clipping: left edge", () => {
    // given
    const canvas = new TestCanvas(8, 8, c0);
    const sprite = new DrawSprite(canvas.bytes, canvas.size);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
    });

    // when
    sprite.draw(image.asset, spr_(-2, 1, 2, 3), xy_(3, 3), new Map());

    // then
    canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      expectedImageAsAscii: `
        - - - - - - - -
        - - - - - - - -
        - - - - - - - -
        - - - # : - - -
        - - - # % - - -
        - - - - - - - -
        - - - - - - - -
        - - - - - - - -
      `,
    });
  });

  test("sprite vs source image clipping: right edge", () => {
    // given
    const canvas = new TestCanvas(8, 8, c0);
    const sprite = new DrawSprite(canvas.bytes, canvas.size);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
    });

    // when
    sprite.draw(image.asset, spr_(2, 1, 6, 3), xy_(3, 3), new Map());

    // then
    canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      expectedImageAsAscii: `
        - - - - - - - -
        - - - - - - - -
        - - - - - - - -
        - - - = % - - -
        - - - : = - - -
        - - - - - - - -
        - - - - - - - -
        - - - - - - - -
      `,
    });
  });

  test("sprite vs source image clipping: top edge", () => {
    // given
    const canvas = new TestCanvas(8, 8, c0);
    const sprite = new DrawSprite(canvas.bytes, canvas.size);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
    });

    // when
    sprite.draw(image.asset, spr_(1, -2, 3, 2), xy_(3, 3), new Map());

    // then
    canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      expectedImageAsAscii: `
        - - - - - - - -
        - - - - - - - -
        - - - - - - - -
        - - - : % - - -
        - - - : = - - -
        - - - - - - - -
        - - - - - - - -
        - - - - - - - -
      `,
    });
  });

  test("sprite vs source image clipping: bottom edge", () => {
    // given
    const canvas = new TestCanvas(8, 8, c0);
    const sprite = new DrawSprite(canvas.bytes, canvas.size);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
    });

    // when
    sprite.draw(image.asset, spr_(1, 2, 3, 6), xy_(3, 3), new Map());

    // then
    canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      expectedImageAsAscii: `
        - - - - - - - -
        - - - - - - - -
        - - - - - - - -
        - - - % : - - -
        - - - = : - - -
        - - - - - - - -
        - - - - - - - -
        - - - - - - - -
      `,
    });
  });

  test("sprite vs canvas clipping: left edge", () => {
    // given
    const canvas = new TestCanvas(6, 6, c0);
    const sprite = new DrawSprite(canvas.bytes, canvas.size);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
    });

    // when
    sprite.draw(image.asset, spr_(0, 0, 4, 4), xy_(-2, 1), new Map());

    // then
    canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      expectedImageAsAscii: `
        - - - - - -
        % = - - - -
        = % - - - -
        : = - - - -
        : % - - - -
        - - - - - -
      `,
    });
  });

  test("sprite vs canvas clipping: right edge", () => {
    // given
    const canvas = new TestCanvas(6, 6, c0);
    const sprite = new DrawSprite(canvas.bytes, canvas.size);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
    });

    // when
    sprite.draw(image.asset, spr_(0, 0, 4, 4), xy_(4, 1), new Map());

    // then
    canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      expectedImageAsAscii: `
        - - - - - -
        - - - - # :
        - - - - # :
        - - - - # %
        - - - - # =
        - - - - - -
      `,
    });
  });

  test("sprite vs canvas clipping: top edge", () => {
    // given
    const canvas = new TestCanvas(6, 6, c0);
    const sprite = new DrawSprite(canvas.bytes, canvas.size);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
    });

    // when
    sprite.draw(image.asset, spr_(0, 0, 4, 4), xy_(1, -2), new Map());

    // then
    canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      expectedImageAsAscii: `
        - # % : = -
        - # = : % -
        - - - - - -
        - - - - - -
        - - - - - -
        - - - - - -
      `,
    });
  });

  test("sprite vs canvas clipping: bottom edge", () => {
    // given
    const canvas = new TestCanvas(6, 6, c0);
    const sprite = new DrawSprite(canvas.bytes, canvas.size);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      image: `
        # : % =
        # : = %
        # % : =
        # = : %
      `,
    });

    // when
    sprite.draw(image.asset, spr_(0, 0, 4, 4), xy_(1, 4), new Map());

    // then
    canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      expectedImageAsAscii: `
        - - - - - -
        - - - - - -
        - - - - - -
        - - - - - -
        - # : % = -
        - # : = % -
      `,
    });
  });

  test("transparency", () => {
    // given
    const canvas = new TestCanvas(4, 4, c0);
    const sprite = new DrawSprite(canvas.bytes, canvas.size);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4, ".": ct },
      image: `
        # # # # : . . : . % . . = . . =
        # . . # . . . . % . . . . = = .
        # . . # . . . . . . . % = . . =
        # # # # : . . : . . % . . = = .
      `,
    });

    // when
    sprite.draw(image.asset, spr_(0, 0, 4, 4), xy_(0, 0), new Map());
    sprite.draw(image.asset, spr_(4, 0, 8, 4), xy_(0, 0), new Map());
    sprite.draw(image.asset, spr_(8, 0, 12, 4), xy_(0, 0), new Map());
    sprite.draw(image.asset, spr_(12, 0, 16, 4), xy_(0, 0), new Map());

    // then
    canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4 },
      expectedImageAsAscii: `
        = % # =
        % = = #
        = - - =
        : = = :
      `,
    });
  });

  test("color mapping", () => {
    // given
    const canvas = new TestCanvas(4, 4, c0);
    const sprite = new DrawSprite(canvas.bytes, canvas.size);
    const image = new TestImage({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, ".": ct },
      image: `
        : # # :
        % . . %
        : % % :
        # . . #
      `,
    });

    // when
    sprite.draw(
      image.asset,
      spr_(0, 0, 4, 4),
      xy_(0, 0),
      new Map([
        [c1.id(), c4],
        [c2.id(), c5],
        [c3.id(), ct],
      ])
    );

    // then
    canvas.expectToEqual({
      withMapping: { "-": c0, "#": c1, ":": c2, "%": c3, "=": c4, "^": c5 },
      expectedImageAsAscii: `
        ^ = = ^
        - - - -
        ^ - - ^
        = - - =
      `,
    });
  });
});
