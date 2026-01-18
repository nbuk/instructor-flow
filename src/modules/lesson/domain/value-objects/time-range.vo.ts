import { ValueObject } from '@/libs/domain/value-object.base';
import { ArgumentInvalidException } from '@/libs/exceptions/exceptions';

export class TimeRange extends ValueObject<{
  startTime: string;
  endTime: string;
}> {
  constructor(startTime: string, endTime: string) {
    super();
    TimeRange.validate(startTime, endTime);
    this.value = { startTime, endTime };
  }

  private static validate(startTime: string, endTime: string): void {
    if (!startTime || !endTime) {
      throw new ArgumentInvalidException('startTime and endTime are required');
    }

    if (!TimeRange.isValidTimeFormat(startTime)) {
      throw new ArgumentInvalidException(
        `Invalid startTime format: ${startTime}`,
      );
    }

    if (!TimeRange.isValidTimeFormat(endTime)) {
      throw new ArgumentInvalidException(`Invalid endTime format: ${endTime}`);
    }

    const startMinutes = TimeRange.toMinutes(startTime);
    const endMinutes = TimeRange.toMinutes(endTime);

    if (startMinutes >= endMinutes) {
      throw new Error('startTime must be less than endTime');
    }
  }

  private static isValidTimeFormat(value: string): boolean {
    const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return TIME_REGEX.test(value);
  }

  private static toMinutes(value: string): number {
    const [hours, minutes] = value.split(':').map(Number);
    return hours * 60 + minutes;
  }
}
