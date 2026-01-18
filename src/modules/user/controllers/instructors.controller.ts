import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { PaginatedQueryDto } from '@/libs/application/dtos/paginated.dto';
import { User } from '@/modules/auth/decorators/user.decorator';
import { InstructorGuard } from '@/modules/auth/guards/instructor.guard';
import type { UserAuthInfo } from '@/modules/auth/types';

import { GetInstructorProfileUseCase } from '../use-cases/get-instructor-profile.use-case';
import { GetInstructorStudentsUseCase } from '../use-cases/get-instructor-students.use-case';
import { UpdateInstructorProfileUseCase } from '../use-cases/update-instructor-profile.use-case';
import { InstructorUpdateProfileDto } from './dtos/profile.dto';
import {
  InstructorProfileResponse,
  InstructorStudentResponse,
  UserInstructorProfileResponse,
} from './dtos/profile.response';

@Controller('instructors')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class InstructorsController {
  constructor(
    private readonly updateProfileUseCase: UpdateInstructorProfileUseCase,
    private readonly getStudentsUseCase: GetInstructorStudentsUseCase,
    private readonly getInstructorProfileUseCase: GetInstructorProfileUseCase,
  ) {}

  @Patch(':instructorId')
  @UseGuards(InstructorGuard)
  async updateProfile(
    @User() user: UserAuthInfo,
    @Param('instructorId') instructorId: string,
    @Body() dto: InstructorUpdateProfileDto,
  ) {
    await this.updateProfileUseCase.execute(user, instructorId, dto);
    return { error: false, message: 'updated' };
  }

  @Get(':instructorId')
  async getInstructorProfile(
    @User() user: UserAuthInfo,
    @Param('instructorId') instructorId: string,
  ) {
    const instructor = await this.getInstructorProfileUseCase.execute(
      user,
      instructorId,
    );
    return plainToInstance(InstructorProfileResponse, instructor.profile);
  }

  @Get(':instructorId/students')
  @UseGuards(InstructorGuard)
  async getInstructorStudents(
    @User() user: UserAuthInfo,
    @Param('instructorId') instructorId: string,
    @Query() query: PaginatedQueryDto,
  ) {
    const result = await this.getStudentsUseCase.execute(user, instructorId, {
      ...query,
      orderBy: { field: query.orderBy, param: query.sort },
    });

    return {
      ...result,
      data: plainToInstance(InstructorStudentResponse, result.data),
    };
  }
}
