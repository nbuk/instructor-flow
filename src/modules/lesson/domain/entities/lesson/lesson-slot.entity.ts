import { uuidv7 } from 'uuidv7';

import { AggregateRoot } from '@/libs/domain/aggregate-root.base';
import {
  ConflictException,
  NotFoundException,
} from '@/libs/exceptions/exceptions';
import {
  LessonRequestApprovedEvent,
  LessonRequestCanceledEvent,
  LessonRequestEvent,
  LessonRequestRejectedEvent,
} from '@/modules/lesson/domain/events';

import { DateRange } from '../../value-objects/date-range.vo';
import { LessonRequestEntity } from './lesson-request.entity';
import { ILessonSlot, LessonSlotStatus } from './types';

export class LessonSlotEntity extends AggregateRoot<ILessonSlot> {
  private readonly instructorId: string;
  private timeSlot: DateRange;
  private status: LessonSlotStatus;
  private readonly requests: LessonRequestEntity[] = [];
  private readonly createdAt: Date;
  private updatedAt: Date;

  private constructor(slot: ILessonSlot) {
    super(slot.id);
    this.instructorId = slot.instructorId;
    this.timeSlot = new DateRange(slot.startAt, slot.endAt);
    this.status = slot.status;
    this.createdAt = slot.createdAt;
    this.updatedAt = slot.updatedAt;

    if (slot.requests) {
      this.requests = slot.requests.map((request) =>
        LessonRequestEntity.restore(request),
      );
    }
  }

  static create(
    slot: Omit<
      ILessonSlot,
      'id' | 'status' | 'requests' | 'createdAt' | 'updatedAt'
    >,
  ) {
    const id = uuidv7();
    const createdAt = new Date();
    return new LessonSlotEntity({
      ...slot,
      id,
      requests: [],
      status: LessonSlotStatus.FREE,
      createdAt,
      updatedAt: createdAt,
    });
  }

  static restore(slot: ILessonSlot) {
    return new LessonSlotEntity(slot);
  }

  public getInstructorId(): string {
    return this.instructorId;
  }

  public getStatus(): LessonSlotStatus {
    return this.status;
  }

  public bookStudent(studentId: string) {
    if (this.status !== LessonSlotStatus.FREE) {
      throw new ConflictException('Slot is not free', {
        status: this.status,
        slotId: this.id,
        studentId,
      });
    }
    this.status = LessonSlotStatus.PENDING;
    const request = LessonRequestEntity.create({
      lessonSlotId: this.id,
      studentId,
    });
    this.requests.push(request);
    this.addEvent(
      new LessonRequestEvent({
        studentId,
        instructorId: this.instructorId,
        aggregateId: this.id,
        date: this.timeSlot.getValue().startTime,
      }),
    );
    this.updatedAt = new Date();
    return this;
  }

  public approveRequest(requestId: string) {
    if (this.status !== LessonSlotStatus.PENDING) {
      throw new ConflictException('Cannot approve request', {
        status: this.status,
        slotId: this.id,
        requestId,
      });
    }
    const request = this.requests.find((b) => b.getId() === requestId);
    if (!request) {
      throw new NotFoundException('The student does not have a request', {
        slotId: this.id,
        requestId,
      });
    }
    request.approve();
    this.status = LessonSlotStatus.BOOKED;
    this.updatedAt = new Date();
    this.addEvent(
      new LessonRequestApprovedEvent({
        aggregateId: this.id,
        studentId: request.getStudentId(),
        date: this.timeSlot.getValue().startTime,
      }),
    );
    return this;
  }

  public rejectRequest(requestId: string) {
    if (this.status !== LessonSlotStatus.PENDING) {
      throw new ConflictException('Cannot reject request', {
        status: this.status,
        slotId: this.id,
        requestId,
      });
    }
    const request = this.requests.find((b) => b.getId() === requestId);
    if (!request) {
      throw new NotFoundException('The student does not have a request', {
        slotId: this.id,
        requestId,
      });
    }
    request.reject();
    this.status = LessonSlotStatus.FREE;
    this.updatedAt = new Date();
    this.addEvent(
      new LessonRequestRejectedEvent({
        aggregateId: this.id,
        studentId: request.getStudentId(),
        instructorId: this.instructorId,
        date: this.timeSlot.getValue().startTime,
      }),
    );
    return this;
  }

  public cancelRequest(requestId: string) {
    if (this.status !== LessonSlotStatus.BOOKED) {
      throw new ConflictException('Cannot cancel request', {
        status: this.status,
        slotId: this.id,
        requestId,
      });
    }
    const request = this.requests.find((b) => b.getId() === requestId);
    if (!request) {
      throw new NotFoundException('The student does not have a request', {
        slotId: this.id,
        requestId,
      });
    }
    request.cancel();
    this.status = LessonSlotStatus.FREE;
    this.updatedAt = new Date();
    this.addEvent(
      new LessonRequestCanceledEvent({
        aggregateId: this.id,
        studentId: request.getStudentId(),
        date: this.timeSlot.getValue().startTime,
      }),
    );
    return this;
  }

  public getDateRange() {
    return this.timeSlot;
  }

  public getRequests() {
    return this.requests.map((request) => request.serialize());
  }

  public delete() {
    if (this.status === LessonSlotStatus.BOOKED) {
      throw new ConflictException('Cannot delete slot with booked request', {
        slotId: this.id,
      });
    }
  }

  public serialize(): ILessonSlot {
    return {
      id: this.id,
      instructorId: this.instructorId,
      startAt: this.timeSlot.getValue().startTime,
      endAt: this.timeSlot.getValue().endTime,
      status: this.status,
      requests: this.requests.map((request) => request.serialize()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
