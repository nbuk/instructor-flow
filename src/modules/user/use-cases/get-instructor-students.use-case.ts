import { Injectable } from '@nestjs/common';

import { PaginatedQueryParams } from '@/libs/database/repository.base';
import {
  ForbiddenException,
  NotFoundException,
} from '@/libs/exceptions/exceptions';
import { UserAuthInfo } from '@/modules/auth/types';

import { AccessPolicy } from '../policies/access.policy';
import { InstructorRepository } from '../repositories/instructor.repository';
import { StudentReadRepository } from '../repositories/student-read.repository';

@Injectable()
export class GetInstructorStudentsUseCase {
  constructor(
    private readonly studentReadRepository: StudentReadRepository,
    private readonly instructorRepository: InstructorRepository,
    private readonly accessPolicy: AccessPolicy,
  ) {}

  async execute(
    user: UserAuthInfo,
    instructorId: string,
    pagination: PaginatedQueryParams,
  ) {
    const instructor = await this.instructorRepository.findById(instructorId);
    if (!instructor) throw new NotFoundException('instructor not found');
    const allowed = this.accessPolicy.canGetInstructorStudents(
      user,
      instructor,
    );
    if (!allowed) throw new ForbiddenException('forbidden');

    return this.studentReadRepository.findByInstructorId(
      instructorId,
      pagination,
    );
  }
}
