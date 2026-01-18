import { uuidv7 } from 'uuidv7';

import { AggregateRoot } from '@/libs/domain/aggregate-root.base';

import { PhoneNumber } from '../../value-objects/phone-number';
import { IStudent } from './types';

export class StudentEntity extends AggregateRoot<IStudent> {
  private readonly userId: string;
  private readonly instructorId: string;
  private firstName: string | null;
  private middleName: string | null;
  private lastName: string | null;
  private phone: PhoneNumber | null;

  private constructor(student: IStudent) {
    super(student.id);
    this.userId = student.userId;
    this.instructorId = student.instructorId;
    this.firstName = student.firstName;
    this.middleName = student.middleName;
    this.lastName = student.lastName;
    this.phone = student.phone ? new PhoneNumber(student.phone) : null;
  }

  static create(userId: string, instructorId: string) {
    const id = uuidv7();
    return new StudentEntity({
      id,
      userId,
      instructorId,
      firstName: null,
      middleName: null,
      lastName: null,
      phone: null,
    });
  }

  static restore(student: IStudent) {
    return new StudentEntity(student);
  }

  public getId() {
    return this.id;
  }

  public getUserId() {
    return this.userId;
  }

  public getInstructorId() {
    return this.instructorId;
  }

  public setFirstName(firstName: string) {
    this.firstName = firstName;
    return this;
  }

  public setMiddleName(middleName: string) {
    this.middleName = middleName;
    return this;
  }

  public setLastName(lastName: string) {
    this.lastName = lastName;
    return this;
  }

  public setPhone(phone: string) {
    this.phone = new PhoneNumber(phone);
    return this;
  }

  public serialize(): IStudent {
    return {
      id: this.id,
      userId: this.userId,
      instructorId: this.instructorId,
      firstName: this.firstName,
      middleName: this.middleName,
      lastName: this.lastName,
      phone: this.phone?.getValue() || null,
    };
  }
}
