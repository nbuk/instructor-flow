import { ValueObject } from '@/libs/domain/value-object.base';
import { ArgumentInvalidException } from '@/libs/exceptions/exceptions';

export class DateRange extends ValueObject<{ startTime: Date; endTime: Date }> {
  constructor(startTime: Date, endTime: Date) {
    super();
    DateRange.validate(startTime, endTime);
    this.value = { startTime, endTime };
  }

  private static validate(startTime: Date, endTime: Date) {
    if (startTime.getTime() > endTime.getTime()) {
      throw new ArgumentInvalidException('startTime must be less than endTime');
    }
  }

  overlaps(other: DateRange): boolean {
    return (
      this.value.startTime < other.value.endTime &&
      this.value.endTime > other.value.startTime
    );
  }
}
