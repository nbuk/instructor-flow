import { AggregateRoot } from '../domain/aggregate-root.base';

export type OrderBy = { field: string; param: 'asc' | 'desc' };

export type PaginatedQueryParams = {
  limit: number;
  offset: number;
  orderBy: OrderBy;
  search?: string;
};

export type Paginated<T> = {
  totalCount: number;
  limit: number;
  offset: number;
  data: T[];
};

export abstract class RepositoryBase<Aggregate extends AggregateRoot<any>> {
  abstract save(entity: Aggregate): Promise<void>;
  abstract findById(id: string): Promise<Aggregate | null>;
  abstract findAll(): Promise<Aggregate[]>;
  abstract findAllPaginated(
    params: PaginatedQueryParams,
  ): Promise<Paginated<Aggregate>>;
  abstract delete(entity: Aggregate): Promise<boolean>;
}
