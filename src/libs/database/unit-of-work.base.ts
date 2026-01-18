import { RepositoryBase } from './repository.base';

export type UnitOfWorkContext = Record<string, RepositoryBase<any>>;

export abstract class UnitOfWork {
  abstract withTransaction<T>(
    work: (ctx: UnitOfWorkContext) => Promise<T>,
  ): Promise<T>;
}
