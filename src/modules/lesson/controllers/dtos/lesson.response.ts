import { Exclude, Expose, Transform, Type } from 'class-transformer';

import {
  LessonRequestStatus,
  LessonSlotStatus,
} from '../../domain/entities/lesson/types';
import { LessonRequestStudent } from './lesson-request.response';

@Exclude()
export class LessonRequest {
  @Expose()
  id: string;

  @Expose()
  status: LessonRequestStatus;

  @Expose()
  @Type(() => LessonRequestStudent)
  student: LessonRequestStudent;
}

@Exclude()
export class StudentLessonResponse {
  @Expose()
  id: string;

  @Expose()
  startAt: Date;

  @Expose()
  endAt: Date;

  @Expose()
  status: LessonSlotStatus;
}

@Exclude()
export class InstructorLessonResponse {
  @Expose()
  id: string;

  @Expose()
  startAt: Date;

  @Expose()
  endAt: Date;

  @Expose()
  status: LessonSlotStatus;

  @Expose()
  @Type(() => LessonRequest)
  request: LessonRequest;
}
