import { DomainEvent, DomainEventProps } from '@/libs/domain/domain-event.base';

export class LessonRequestRejectedEvent extends DomainEvent {
  readonly studentId: string;
  readonly instructorId: string;
  readonly date: Date;
  readonly timezone: string;

  constructor(props: DomainEventProps<LessonRequestRejectedEvent>) {
    super(props);
    this.studentId = props.studentId;
    this.instructorId = props.instructorId;
    this.date = props.date;
    this.timezone = props.timezone;
  }
}
