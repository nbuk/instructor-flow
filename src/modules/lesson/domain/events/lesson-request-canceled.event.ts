import { DomainEvent, DomainEventProps } from '@/libs/domain/domain-event.base';

export class LessonRequestCanceledEvent extends DomainEvent {
  readonly studentId: string;
  readonly date: Date;
  readonly timezone: string;

  constructor(props: DomainEventProps<LessonRequestCanceledEvent>) {
    super(props);
    this.studentId = props.studentId;
    this.date = props.date;
    this.timezone = props.timezone;
  }
}
