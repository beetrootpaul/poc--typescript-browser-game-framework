// TODO: tests!
export class FillPattern {
  static of(bits: number): FillPattern {
    return new FillPattern(bits);
  }

  // noinspection JSUnusedGlobalSymbols
  static primaryOnly = new FillPattern(0b0000_0000_0000_0000);
  // noinspection JSUnusedGlobalSymbols
  static secondaryOnly = new FillPattern(0b1111_1111_1111_1111);

  readonly #bits: number;

  private constructor(bits: number) {
    this.#bits = bits;
  }
}
