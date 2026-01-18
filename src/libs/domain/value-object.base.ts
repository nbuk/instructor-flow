export abstract class ValueObject<T> {
  protected value: T;
  public getValue(): T {
    return this.value;
  }
}
