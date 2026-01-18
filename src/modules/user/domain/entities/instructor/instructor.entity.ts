import { uuidv7 } from 'uuidv7';

import { AggregateRoot } from '@/libs/domain/aggregate-root.base';

import { PhoneNumber } from '../../value-objects/phone-number';
import { InstructorCar } from './car.entity';
import { IInstructor } from './types';

export class InstructorEntity extends AggregateRoot<IInstructor> {
  private readonly userId: string;
  private firstName: string | null;
  private middleName: string | null;
  private lastName: string | null;
  private phone: PhoneNumber | null;
  private car: InstructorCar | null;

  private constructor(
    instructor: Omit<IInstructor, 'car'> & { car: InstructorCar | null },
  ) {
    super(instructor.id);
    this.userId = instructor.userId;
    this.firstName = instructor.firstName || null;
    this.middleName = instructor.middleName || null;
    this.lastName = instructor.lastName || null;
    this.phone = instructor.phone ? new PhoneNumber(instructor.phone) : null;
    this.car = instructor.car;
  }

  static create(userId: string) {
    const id = uuidv7();
    return new InstructorEntity({
      id,
      userId,
      firstName: null,
      middleName: null,
      lastName: null,
      phone: null,
      car: null,
    });
  }

  static restore(instructor: IInstructor) {
    const car = instructor.car ? InstructorCar.restore(instructor.car) : null;
    return new InstructorEntity({ ...instructor, car });
  }

  public getId() {
    return this.id;
  }

  public getUserId() {
    return this.userId;
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

  public setCarInfo(model: string, licensePlate: string) {
    if (!this.car) {
      this.car = InstructorCar.create({
        model,
        licensePlate,
        instructorId: this.id,
      });
      return this;
    }
    this.car.setModel(model).setLicensePlate(licensePlate);
    return this;
  }

  public serialize(): IInstructor {
    return {
      id: this.id,
      userId: this.userId,
      firstName: this.firstName,
      middleName: this.middleName,
      lastName: this.lastName,
      phone: this.phone?.getValue() || null,
      car: this.car?.serialize() || null,
    };
  }
}
