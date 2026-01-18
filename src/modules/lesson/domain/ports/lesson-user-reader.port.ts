import { UserRole, UserRoleType } from '@/modules/user/domain/entities/user';

export abstract class LessonUserReaderPort {
  abstract getUserInfo(userId: string): Promise<UserInfo | null>;
  abstract getUserInfoByStudentId(
    studentId: string,
  ): Promise<StudentUserInfo | null>;
  abstract getUserInfoByInstructorId(
    instructorId: string,
  ): Promise<InstructorUserInfo | null>;
}

interface BaseUserInfo {
  id: string;
  tgId: string;
  role: UserRoleType;
}

interface BaseUserProfile {
  id: string;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  phone: string | null;
}

interface InstructorProfile extends BaseUserProfile {
  car: InstructorCar | null;
}

export interface InstructorUserInfo extends BaseUserInfo {
  role: typeof UserRole.INSTRUCTOR;
  profile: InstructorProfile;
}

interface InstructorCar {
  model: string;
  licensePlate: string;
}

export interface StudentProfile extends BaseUserProfile {
  instructorId: string;
}

export interface StudentUserInfo extends BaseUserInfo {
  role: typeof UserRole.STUDENT;
  profile: StudentProfile;
}

export interface AdminUserInfo extends BaseUserInfo {
  role: typeof UserRole.ADMIN;
}

export type UserInfo = InstructorUserInfo | StudentUserInfo | AdminUserInfo;
