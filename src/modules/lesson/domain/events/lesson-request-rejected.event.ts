import { DomainEvent, DomainEventProps } from '@/libs/domain/domain-event.base';

export class LessonRequestRejectedEvent extends DomainEvent {
  readonly studentId: string;
  readonly instructorId: string;
  readonly date: Date;

  constructor(props: DomainEventProps<LessonRequestRejectedEvent>) {
    super(props);
    this.studentId = props.studentId;
    this.instructorId = props.instructorId;
    this.date = props.date;
  }
}
