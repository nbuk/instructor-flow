import { DomainEvent, DomainEventProps } from '@/libs/domain/domain-event.base';

export class LessonRequestEvent extends DomainEvent {
  readonly studentId: string;
  readonly instructorId: string;
  readonly date: Date;
  readonly timezone: string;

  constructor(props: DomainEventProps<LessonRequestEvent>) {
    super(props);
    this.instructorId = props.instructorId;
    this.studentId = props.studentId;
    this.date = props.date;
    this.timezone = props.timezone;
  }
}
