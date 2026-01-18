export interface ILessonSlot {
  id: string;
  instructorId: string;
  startAt: Date;
  endAt: Date;
  status: LessonSlotStatus;
  requests: ILessonRequest[];
  createdAt: Date;
  updatedAt: Date;
}

export const LessonSlotStatus = {
  FREE: 'FREE',
  PENDING: 'PENDING',
  BOOKED: 'BOOKED',
} as const;

export type LessonSlotStatus =
  (typeof LessonSlotStatus)[keyof typeof LessonSlotStatus];

export interface ILessonRequest {
  id: string;
  studentId: string;
  lessonSlotId: string;
  status: LessonRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

export const LessonRequestStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELED: 'CANCELED',
} as const;

export type LessonRequestStatus =
  (typeof LessonRequestStatus)[keyof typeof LessonRequestStatus];
