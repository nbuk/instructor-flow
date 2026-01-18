import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { DomainEvent } from './domain-event.base';

export abstract class AggregateRoot<T> {
  protected constructor(protected readonly id: string) {}

  protected readonly events: DomainEvent[] = [];

  public getId() {
    return this.id;
  }

  protected addEvent(event: DomainEvent) {
    this.events.push(event);
  }

  public async publishEvents(logger: Logger, eventEmitter: EventEmitter2) {
    await Promise.all(
      this.events.map((event) => {
        logger.debug(
          `[${event.constructor.name}] event published for aggregate ${this.constructor.name} : ${this.id}`,
        );
        return eventEmitter.emitAsync(event.constructor.name, event);
      }),
    );
    this.clearEvents();
  }

  private clearEvents() {
    this.events.length = 0;
  }

  public abstract serialize(): T;
}
