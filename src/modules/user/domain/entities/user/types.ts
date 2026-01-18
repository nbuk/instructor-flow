export interface IUser {
  id: string;
  role: UserRoleType;
  tgId: string;
  status: UserStatusType;
  createdAt: Date;
  updatedAt: Date;
}

export const UserRole = {
  ADMIN: 'ADMIN',
  INSTRUCTOR: 'INSTRUCTOR',
  STUDENT: 'STUDENT',
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export type UserStatusType = (typeof UserStatus)[keyof typeof UserStatus];
