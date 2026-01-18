import type { UserStatus } from '@/entities/account';

export interface InstructorProfile {
  instructorId: string;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  phone: string | null;
  car: InstructorCar | null;
}

export interface InstructorCar {
  model: string;
  licensePlate: string;
}

interface StudentProfile {
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
}

export interface InstructorStudentProfile extends StudentProfile {
  userId: string;
  status: UserStatus;
}
