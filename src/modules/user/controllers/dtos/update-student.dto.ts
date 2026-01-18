import { IsIn } from 'class-validator';

import { UserStatus, type UserStatusType } from '../../domain/entities/user';

export class UpdateStudentDto {
  @IsIn(Object.values(UserStatus))
  status: UserStatusType;
}
