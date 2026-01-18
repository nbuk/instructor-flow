export interface IInstructor {
  id: string;
  userId: string;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  phone: string | null;
  car: IInstructorCar | null;
}

export interface IInstructorCar {
  id: string;
  instructorId: string;
  model: string;
  licensePlate: string;
}
