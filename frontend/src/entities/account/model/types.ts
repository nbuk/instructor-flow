import type { InstructorProfile } from '@/entities/instructor';
import type { StudentProfile } from '@/entities/student';

export interface Account<T extends UserRole = UserRole> {
  id: string;
  role: UserRole;
  profile: T extends UserRole.STUDENT ? StudentProfile : InstructorProfile;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
  INSTRUCTOR = 'INSTRUCTOR',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
