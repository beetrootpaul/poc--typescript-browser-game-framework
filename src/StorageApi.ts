export type StorageApiValueConstraint = Record<
  string,
  string | number | boolean | null
>;

export class StorageApi<StorageApiValue extends StorageApiValueConstraint> {
  static readonly #key: string = "game_stored_state";

  store(value: StorageApiValue): void {
    window.localStorage.setItem(
      StorageApi.#key,
      JSON.stringify(value, null, 2)
    );
  }

  load(): StorageApiValue | null {
    const maybeValue: string | null = window.localStorage.getItem(
      StorageApi.#key
    );
    return maybeValue ? (JSON.parse(maybeValue) as StorageApiValue) : null;
  }

  clear() {
    window.localStorage.removeItem(StorageApi.#key);
  }
}
