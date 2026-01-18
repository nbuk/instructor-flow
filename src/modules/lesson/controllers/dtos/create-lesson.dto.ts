import { IsDateString } from 'class-validator';

export class CreateLessonDto {
  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;
}
