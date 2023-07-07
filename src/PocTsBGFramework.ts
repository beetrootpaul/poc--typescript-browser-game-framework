import { DrawApi } from "./DrawApi.ts";
import { GameInputEvent } from "./game_input/GameInput.ts";

// TODO: after name for the framework gets chosen: rename this to the framework name or to its abbreviation
export class PocTsBGFramework {
  // It is possible that all these fields are undefined when called (if Framework instance was not
  //   created yet), but we are OK with it. It's a good price to pay for an easy to access global API.
  static frameNumber: number;
  static drawApi: DrawApi;
  static gameInputEvents: Set<GameInputEvent>;
}
