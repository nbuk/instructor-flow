import { IsBoolean } from 'class-validator';

export class StudentLessonsDto {
  @IsBoolean()
  upcoming: boolean;
}
