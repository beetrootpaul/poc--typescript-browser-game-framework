import { describe, expect, test } from "@jest/globals";
import { xy_ } from "../Xy";
import { FillPattern } from "./FillPattern";

describe("FillPattern", () => {
  test("#hasPrimaryColorAt", () => {
    // given
    const fillPattern = FillPattern.of(0b0101_1100_0101_0011);

    // then for the 1st row of 4 pixels
    expect(fillPattern.hasPrimaryColorAt(xy_(0, 0))).toBe(true);
    expect(fillPattern.hasPrimaryColorAt(xy_(1, 0))).toBe(false);
    expect(fillPattern.hasPrimaryColorAt(xy_(2, 0))).toBe(true);
    expect(fillPattern.hasPrimaryColorAt(xy_(3, 0))).toBe(false);

    // and for the 2nd row of 4 pixels
    expect(fillPattern.hasPrimaryColorAt(xy_(0, 1))).toBe(false);
    expect(fillPattern.hasPrimaryColorAt(xy_(1, 1))).toBe(false);
    expect(fillPattern.hasPrimaryColorAt(xy_(2, 1))).toBe(true);
    expect(fillPattern.hasPrimaryColorAt(xy_(3, 1))).toBe(true);

    // and for the 3rd row of 4 pixels
    expect(fillPattern.hasPrimaryColorAt(xy_(0, 2))).toBe(true);
    expect(fillPattern.hasPrimaryColorAt(xy_(1, 2))).toBe(false);
    expect(fillPattern.hasPrimaryColorAt(xy_(2, 2))).toBe(true);
    expect(fillPattern.hasPrimaryColorAt(xy_(3, 2))).toBe(false);

    // and for the 4th row of 4 pixels
    expect(fillPattern.hasPrimaryColorAt(xy_(0, 3))).toBe(true);
    expect(fillPattern.hasPrimaryColorAt(xy_(1, 3))).toBe(true);
    expect(fillPattern.hasPrimaryColorAt(xy_(2, 3))).toBe(false);
    expect(fillPattern.hasPrimaryColorAt(xy_(3, 3))).toBe(false);

    // and for positions outside the 4x4 grid
    expect(fillPattern.hasPrimaryColorAt(xy_(4, 0))).toBe(true);
    expect(fillPattern.hasPrimaryColorAt(xy_(5, 0))).toBe(false);
    expect(fillPattern.hasPrimaryColorAt(xy_(0, 4))).toBe(true);
    expect(fillPattern.hasPrimaryColorAt(xy_(0, 5))).toBe(false);
  });
});
