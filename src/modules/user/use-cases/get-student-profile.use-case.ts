import { Injectable } from '@nestjs/common';

import {
  ForbiddenException,
  NotFoundException,
} from '@/libs/exceptions/exceptions';
import { UserAuthInfo } from '@/modules/auth/types';

import { AccessPolicy } from '../policies/access.policy';
import { StudentRepository } from '../repositories/student.repository';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class GetStudentProfileUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly studentRepository: StudentRepository,
    private readonly policy: AccessPolicy,
  ) {}

  async execute(actor: UserAuthInfo, studentId: string) {
    const student = await this.studentRepository.findById(studentId);
    if (!student) throw new NotFoundException('student not found');
    const allowed = this.policy.canGetStudentProfile(actor, student);
    if (!allowed) throw new ForbiddenException('forbidden');
    const user = await this.userRepository.findById(student.getUserId());
    if (!user) throw new NotFoundException('user not found');
    return { ...user, profile: student.serialize() };
  }
}
