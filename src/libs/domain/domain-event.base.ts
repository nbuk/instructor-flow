import { randomUUID } from 'node:crypto';

type DomainEventMetadata = {
  timestamp: number;
  userId?: string;
};

export type DomainEventProps<T> = Omit<T, 'id' | 'metadata'> & {
  aggregateId: string;
  metadata?: DomainEventMetadata;
};

export abstract class DomainEvent {
  public readonly id: string;
  public readonly aggregateId: string;
  public readonly metadata: DomainEventMetadata;

  protected constructor(props: DomainEventProps<unknown>) {
    this.id = randomUUID();
    this.aggregateId = props.aggregateId;
    this.metadata = {
      timestamp: props?.metadata?.timestamp ?? Date.now(),
      userId: props?.metadata?.userId,
    };
  }
}
