import { GamepadGameInput } from "./gamepadGameInput.ts";
import { KeyboardGameInput } from "./keyboardGameInput.ts";
import { TouchGameInput } from "./touchGameInput.ts";

export type GameInputEvent =
  | null
  | "left"
  | "right"
  | "up"
  | "down"
  | "full_screen";

export const gameInputEventBehavior: Record<string, { fireOnce?: boolean }> = {
  // TODO: move full_screen out of this set OR move its handling to TouchGameInput and similar ones
  full_screen: { fireOnce: true },
};

export class GameInput {
  readonly #keyboardGameInput = new KeyboardGameInput();
  readonly #touchGameInput = new TouchGameInput();
  readonly #gamepadGameInput = new GamepadGameInput();

  startListening() {
    this.#keyboardGameInput.startListening();
    this.#touchGameInput.startListening();
  }

  getCurrentContinuousEvents(): Set<GameInputEvent> {
    const detectedEvents = new Set<GameInputEvent>();
    for (const event of this.#keyboardGameInput.getCurrentContinuousEvents()) {
      detectedEvents.add(event);
    }
    for (const event of this.#touchGameInput.getCurrentContinuousEvents()) {
      detectedEvents.add(event);
    }
    for (const event of this.#gamepadGameInput.getCurrentContinuousEvents()) {
      detectedEvents.add(event);
    }
    return detectedEvents;
  }

  consumeFireOnceEvents(): Set<GameInputEvent> {
    const detectedEvents = new Set<GameInputEvent>();
    for (const event of this.#keyboardGameInput.consumeFireOnceEvents()) {
      detectedEvents.add(event);
    }
    return detectedEvents;
  }
}
