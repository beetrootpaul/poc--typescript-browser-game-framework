import { Sprite } from "../Sprite.ts";
import { Xy } from "../Xy.ts";

export type CharSprite = {
  positionInText: Xy;
  sprite: Sprite;
};

export interface Font {
  spritesFor(text: string): CharSprite[];
}
