import { uuidv7 } from 'uuidv7';

import { Entity } from '@/libs/domain/entity.base';

import { IInstructorCar } from './types';

export class InstructorCar extends Entity<IInstructorCar> {
  private readonly instructorId: string;
  private model: string;
  private licensePlate: string;

  private constructor(car: IInstructorCar) {
    super(car.id);
    this.instructorId = car.instructorId;
    this.model = car.model;
    this.licensePlate = car.licensePlate;
  }

  static create(car: Omit<IInstructorCar, 'id'>) {
    const id = uuidv7();
    return new InstructorCar({ id, ...car });
  }

  static restore(car: IInstructorCar) {
    return new InstructorCar(car);
  }

  public setModel(model: string) {
    this.model = model;
    return this;
  }

  public setLicensePlate(licensePlate: string) {
    this.licensePlate = licensePlate;
    return this;
  }

  serialize(): IInstructorCar {
    return {
      id: this.id,
      instructorId: this.instructorId,
      model: this.model,
      licensePlate: this.licensePlate,
    };
  }
}
