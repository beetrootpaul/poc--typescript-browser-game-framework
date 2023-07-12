import { Sprite } from "../Sprite.ts";
import { Xy } from "../Xy.ts";

export interface Font {
  spriteFor(char: string): Sprite | null;

  sizeOf(text: string): Xy;

  get letterSpacingW(): number;

  get spaceCharW(): number;
}
