import { uuidv7 } from 'uuidv7';

import { Entity } from '@/libs/domain/entity.base';
import { ConflictException } from '@/libs/exceptions/exceptions';

import { ILessonRequest, LessonRequestStatus } from './types';

export class LessonRequestEntity extends Entity<ILessonRequest> {
  private readonly lessonSlotId: string;
  private readonly studentId: string;
  private status: LessonRequestStatus;
  private readonly createdAt: Date;
  private updatedAt: Date;

  private constructor(request: ILessonRequest) {
    super(request.id);
    this.lessonSlotId = request.lessonSlotId;
    this.studentId = request.studentId;
    this.status = request.status;
    this.createdAt = request.createdAt;
    this.updatedAt = request.updatedAt;
  }

  static create(
    request: Omit<ILessonRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>,
  ) {
    const id = uuidv7();
    const createdAt = new Date();
    return new LessonRequestEntity({
      ...request,
      id,
      status: LessonRequestStatus.PENDING,
      createdAt,
      updatedAt: createdAt,
    });
  }

  static restore(request: ILessonRequest): LessonRequestEntity {
    return new LessonRequestEntity(request);
  }

  public getStudentId() {
    return this.studentId;
  }

  public approve() {
    if (this.status !== LessonRequestStatus.PENDING) {
      throw new ConflictException('Cannot approve request', {
        request: this.serialize(),
      });
    }
    this.status = LessonRequestStatus.APPROVED;
    this.updatedAt = new Date();
    return this;
  }

  public reject() {
    if (this.status !== LessonRequestStatus.PENDING) {
      throw new ConflictException('Cannot reject request', {
        request: this.serialize(),
      });
    }
    this.status = LessonRequestStatus.REJECTED;
    this.updatedAt = new Date();
    return this;
  }

  public cancel() {
    if (this.status !== LessonRequestStatus.APPROVED) {
      throw new ConflictException('Cannot cancel request', {
        request: this.serialize(),
      });
    }
    this.status = LessonRequestStatus.CANCELED;
    this.updatedAt = new Date();
    return this;
  }

  serialize(): ILessonRequest {
    return {
      id: this.id,
      lessonSlotId: this.lessonSlotId,
      studentId: this.studentId,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
