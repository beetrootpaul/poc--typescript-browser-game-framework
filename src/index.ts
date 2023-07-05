// TODO: consider naming types in a way which allows to easily spot which one should be imported as a type and which one as a non-type
export type { Color } from "./Color.ts";
export type {
  GameOnStart,
  GameOnUpdate,
  GameOnDraw,
  GameDrawContext,
  GameUpdateContext,
  GameStartContext,
} from "./Framework.ts";
export type { StorageApiValueConstraint } from "./StorageApi.ts";

export { SolidColor, TransparentColor, transparent } from "./Color.ts";
export { DrawApi } from "./DrawApi.ts";
export { Framework } from "./Framework.ts";
export { xy_, Xy } from "./Xy.ts";
