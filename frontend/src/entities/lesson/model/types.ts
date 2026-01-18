export interface Lesson {
  id: string;
  startAt: string;
  endAt: string;
  status: LessonStatus;
  request?: LessonRequest;
}

export enum LessonStatus {
  FREE = 'FREE',
  PENDING = 'PENDING',
  BOOKED = 'BOOKED',
}

export interface LessonRequest {
  id: string;
  student: LessonRequestStudent;
  status: LessonRequestStatus;
}

export interface LessonRequestStudent {
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
}

export enum LessonRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED',
}

export interface PendingLessonRequest {
  id: string;
  student: LessonRequestStudent;
  lessonSlot: Lesson;
  createdAt: Date;
}
