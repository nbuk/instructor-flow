import { Controller, Get } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { User } from '@/modules/auth/decorators/user.decorator';
import type { UserAuthInfo } from '@/modules/auth/types';

import { UserRole } from '../domain/entities/user';
import { GetInstructorProfileUseCase } from '../use-cases/get-instructor-profile.use-case';
import { GetStudentProfileUseCase } from '../use-cases/get-student-profile.use-case';
import {
  UserInstructorProfileResponse,
  UserStudentProfileResponse,
} from './dtos/profile.response';

@Controller('users')
export class UsersController {
  constructor(
    private readonly getInstructorProfileUseCase: GetInstructorProfileUseCase,
    private readonly getStudentProfileUseCase: GetStudentProfileUseCase,
  ) {}

  @Get('me')
  async getMyProfile(@User() user: UserAuthInfo) {
    if (user.role === UserRole.INSTRUCTOR) {
      const profile = await this.getInstructorProfileUseCase.execute(
        user,
        user.instructorId,
      );
      return plainToInstance(UserInstructorProfileResponse, profile);
    }
    if (user.role === UserRole.STUDENT) {
      const profile = await this.getStudentProfileUseCase.execute(
        user,
        user.studentId,
      );
      return plainToInstance(UserStudentProfileResponse, profile);
    }

    return null;
  }
}
