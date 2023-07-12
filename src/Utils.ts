import { PocTsBGFramework } from "./PocTsBGFramework.ts";
import { Xy } from "./Xy.ts";

export class Utils {
  // Returns the middle number. Example usage: `clamp(min, value, max)`
  //   in order to find a value which is:
  //   - `value` if it is `>= min` and `<= max`
  //   - `min` if `value` is `< min`
  //   - `max` if `value` is `> max`
  static clamp(a: number, b: number, c: number): number {
    return a + b + c - Math.min(a, b, c) - Math.max(a, b, c);
  }

  // TODO: migrate from Lua
  /*
  function u.boolean_changing_every_nth_second(n)
    return ceil(sin(time() * 0.5 / n) / 2) == 1
end
*/

  static measureTextSize(text: string): Xy {
    const font = PocTsBGFramework.drawApi.getFont();
    return font?.sizeOf(text) ?? Xy.zero;
  }

  // TODO: migrate from Lua
  /*
  function u.print_with_outline(text, x, y, text_color, outline_color)
    -- Docs on Control Codes: https://www.lexaloffle.com/dl/docs/pico-8_manual.html#Control_Codes
    for control_code in all(split "\-f,\-h,\|f,\|h,\+ff,\+hh,\+fh,\+hf") do
        print(control_code .. text, x, y, outline_color)
    end
    print(text, x, y, text_color)
end
*/
  // TODO: migrate from Lua
  /*
  function u.trim(text)
    local result = text
    while sub(result, 1, 1) == ' ' do
        result = sub(result, 2)
    end
    while sub(result, #result, #result) == ' ' do
        result = sub(result, 0, #result - 1)
    end
    return result
end
*/

  // to be used as a value, e.g. in `definedValue: maybeUndefined() ?? throwError("…")`
  static throwError(message: string): never {
    throw Error(message);
  }
}
