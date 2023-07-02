export class Xy {
  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  min(): number {
    return Math.min(this.x, this.y);
  }

  floor(): Xy {
    return new Xy(Math.floor(this.x), Math.floor(this.y));
  }

  sub(other: Xy): Xy {
    return new Xy(this.x - other.x, this.y - other.y);
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
}
