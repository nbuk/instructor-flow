import { LessonSlotStatus } from '@/modules/lesson/domain/entities/lesson/types';

export abstract class UserLessonReaderPort {
  abstract getStudentLessons(
    studentId: string,
    upcoming: boolean,
  ): Promise<LessonInfo[]>;
}

export interface LessonInfo {
  id: string;
  instructorId: string;
  status: LessonSlotStatus;
  startAt: Date;
  endAt: Date;
}
