import { IsDateString, IsTimeZone } from 'class-validator';

export class CreateLessonDto {
  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsTimeZone()
  timezone: string;
}
