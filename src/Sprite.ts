import { Xy } from "./Xy.ts";

export function spr_(xy: Xy, wh: Xy): Sprite {
  return new Sprite(xy, wh);
}

// TODO: add a sprite sheet ID or just an image ID
export class Sprite {
  readonly xy1: Xy;
  readonly xy2: Xy;

  constructor(xy: Xy, wh: Xy) {
    this.xy1 = xy;
    this.xy2 = xy.add(wh);
  }
}
