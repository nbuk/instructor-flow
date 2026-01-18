import { SceneContext } from 'telegraf/scenes';

import {
  type IUser,
  UserRole,
  type UserRoleType,
  type UserStatusType,
} from '@/modules/user/domain/entities/user';

export interface BaseUserAuthInfo {
  id: string;
  role: UserRoleType;
  tgId: string;
  status: UserStatusType;
}

interface InstructorUserAuthInfo extends BaseUserAuthInfo {
  role: typeof UserRole.INSTRUCTOR;
  instructorId: string;
}

interface StudentUserAuthInfo extends BaseUserAuthInfo {
  role: typeof UserRole.STUDENT;
  studentId: string;
  instructorId: string;
}

interface AdminUserAuthInfo extends BaseUserAuthInfo {
  role: typeof UserRole.ADMIN;
}

export type UserAuthInfo =
  | InstructorUserAuthInfo
  | StudentUserAuthInfo
  | AdminUserAuthInfo;

export interface JwtAccessTokenPayload {
  userId: string;
  role: UserRoleType;
  exp: number;
  iat: number;
}

export interface JwtRefreshTokenPayload {
  code: string;
  exp: number;
  iat: number;
}

export interface ISession {
  id: string;
  userId: string;
  user?: IUser;
  code: string;
  expiredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TelegrafContext extends SceneContext {
  user?: UserAuthInfo;
}
