import { SolidColor } from "../Color.ts";
import { Xy } from "../Xy.ts";

// TODO: tests

export class DrawText {
  draw(text: string, canvasXy1: Xy, color: SolidColor): void {
    // TODO: a proper implementation
    console.info(`print: (${canvasXy1.x},${canvasXy1.y}) [${color.asRgbCssHex()}] ${text}`);
  }
}
