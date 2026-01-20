import { DomainEvent, DomainEventProps } from '@/libs/domain/domain-event.base';

export class LessonRequestApprovedEvent extends DomainEvent {
  readonly studentId: string;
  readonly date: Date;
  readonly timezone: string;

  constructor(props: DomainEventProps<LessonRequestApprovedEvent>) {
    super(props);
    this.studentId = props.studentId;
    this.date = props.date;
    this.timezone = props.timezone;
  }
}
