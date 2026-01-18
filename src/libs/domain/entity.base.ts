export abstract class Entity<T> {
  protected constructor(protected readonly id: string) {}

  public getId() {
    return this.id;
  }
  public abstract serialize(): T;
}
