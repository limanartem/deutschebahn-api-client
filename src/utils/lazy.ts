/**
 * Represents a lazily initialized value.
 * The value is initialized only when it is first accessed.
 *
 * @template T - The type of the value.
 */
export class Lazy<T> {
  private initialized: boolean = false;
  private value?: T;
  private initializer: () => T | Promise<T>;

  /**
   * Creates a new instance of the Lazy class.
   *
   * @param initializer - A function that initializes the value.
   */
  constructor(initializer: () => T | Promise<T>) {
    this.initializer = initializer;
  }

  /**
   * Gets the value. If the value is not yet initialized, it will be initialized and cached.
   *
   * @returns A Promise that resolves to the value.
   */
  async getValue(): Promise<T> {
    if (!this.initialized) {
      const result = this.initializer();
      if (result instanceof Promise) {
        this.value = await result;
      } else {
        this.value = result;
      }
      this.initialized = true;
    }
    return this.value!;
  }
}
