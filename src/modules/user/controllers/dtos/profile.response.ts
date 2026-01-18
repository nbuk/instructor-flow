import { Exclude, Expose, Transform, Type } from 'class-transformer';

import {
  type UserRoleType,
  type UserStatusType,
} from '../../domain/entities/user';

@Exclude()
class InstructorCar {
  @Expose()
  model: string;

  @Expose()
  licensePlate: string;
}

@Exclude()
export class InstructorProfileResponse {
  @Expose({ name: 'id' })
  instructorId: string;

  @Expose()
  firstName: string;

  @Expose()
  middleName: string;

  @Expose()
  lastName: string;

  @Expose()
  phone: string;

  @Expose()
  @Type(() => InstructorCar)
  car: InstructorCar;
}

@Exclude()
export class UserInstructorProfileResponse {
  @Expose()
  id: string;

  @Expose()
  role: UserRoleType;

  @Expose()
  @Type(() => InstructorProfileResponse)
  profile: InstructorProfileResponse;
}

@Exclude()
class StudentProfile {
  @Expose({ name: 'id' })
  studentId: string;

  @Expose()
  instructorId: string;

  @Expose()
  firstName: string;

  @Expose()
  middleName: string;

  @Expose()
  lastName: string;

  @Expose()
  phone: string;
}

@Exclude()
export class UserStudentProfileResponse {
  @Expose()
  id: string;

  @Expose()
  role: UserRoleType;

  @Expose()
  @Type(() => StudentProfile)
  profile: StudentProfile;
}

@Exclude()
export class InstructorStudentResponse {
  @Expose()
  id: string;

  @Expose()
  userId: string;

  @Expose()
  firstName: string;

  @Expose()
  middleName: string;

  @Expose()
  lastName: string;

  @Expose()
  phone: string;

  @Expose()
  @Transform(({ obj }) => obj.user?.status)
  status: UserStatusType;
}
