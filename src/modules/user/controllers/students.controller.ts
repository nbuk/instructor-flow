import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';

import { User } from '@/modules/auth/decorators/user.decorator';
import { InstructorGuard } from '@/modules/auth/guards/instructor.guard';
import type { UserAuthInfo } from '@/modules/auth/types';

import { ChangeStudentStatusUseCase } from '../use-cases/change-student-status.use-case';
import { UpdateStudentProfileUseCase } from '../use-cases/update-student-profile.use-case';
import { StudentUpdateProfileDto } from './dtos/profile.dto';
import { UpdateStudentDto } from './dtos/update-student.dto';

@Controller('students')
export class StudentsController {
  constructor(
    private readonly updateProfileUseCase: UpdateStudentProfileUseCase,
    private readonly changeStudentStatusUseCase: ChangeStudentStatusUseCase,
  ) {}

  @Patch(':studentId')
  async updateProfile(
    @User() user: UserAuthInfo,
    @Param('studentId') studentId: string,
    @Body() dto: StudentUpdateProfileDto,
  ) {
    await this.updateProfileUseCase.execute(user, studentId, dto);
    return { error: false, message: 'updated' };
  }

  @Patch(':studentId/status')
  @UseGuards(InstructorGuard)
  async updateStudentStatus(
    @User() user: UserAuthInfo,
    @Param('studentId') studentId: string,
    @Body() dto: UpdateStudentDto,
  ) {
    await this.changeStudentStatusUseCase.execute(user, studentId, dto.status);
    return { error: false, message: 'updated' };
  }
}
