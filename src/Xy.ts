import { PrintDebug } from "./debug/PrintDebug.ts";

export function xy_(x: number, y: number): Xy {
  return new Xy(x, y);
}

export class Xy implements PrintDebug {
  static zero = new Xy(0, 0);

  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  min(): number {
    return Math.min(this.x, this.y);
  }

  round(): Xy {
    return new Xy(Math.round(this.x), Math.round(this.y));
  }

  floor(): Xy {
    return new Xy(Math.floor(this.x), Math.floor(this.y));
  }

  add(other: Xy | number): Xy {
    return typeof other === "number"
      ? new Xy(this.x + other, this.y + other)
      : new Xy(this.x + other.x, this.y + other.y);
  }

  sub(other: Xy | number): Xy {
    return typeof other === "number"
      ? new Xy(this.x - other, this.y - other)
      : new Xy(this.x - other.x, this.y - other.y);
  }

  mul(other: Xy | number): Xy {
    return typeof other === "number"
      ? new Xy(this.x * other, this.y * other)
      : new Xy(this.x * other.x, this.y * other.y);
  }

  div(other: Xy | number): Xy {
    return typeof other === "number"
      ? new Xy(this.x / other, this.y / other)
      : new Xy(this.x / other.x, this.y / other.y);
  }

  d(): string {
    return `(${this.x},${this.y})`;
  }
}
