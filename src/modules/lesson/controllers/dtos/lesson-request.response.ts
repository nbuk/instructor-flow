import { Exclude, Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

@Exclude()
export class LessonRequestStudent {
  @Expose()
  firstName: string;

  @Expose()
  middleName: string;

  @Expose()
  lastName: string;

  @Expose()
  phone: string;
}

@Exclude()
class LessonSlot {
  @Expose()
  id: string;

  @Expose()
  startAt: Date;

  @Expose()
  endAt: Date;
}

@Exclude()
export class LessonRequestResponse {
  @Expose()
  id: string;

  @Expose()
  @ValidateNested()
  @Type(() => LessonRequestStudent)
  student: LessonRequestStudent;

  @Expose()
  @ValidateNested()
  @Type(() => LessonSlot)
  lessonSlot: LessonSlot;

  @Expose()
  createdAt: Date;
}
