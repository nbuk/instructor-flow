import { ForbiddenException, Injectable } from '@nestjs/common';

import { NotFoundException } from '@/libs/exceptions/exceptions';
import { UserAuthInfo } from '@/modules/auth/types';

import { type UserStatusType } from '../domain/entities/user';
import { AccessPolicy } from '../policies/access.policy';
import { StudentRepository } from '../repositories/student.repository';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class ChangeStudentStatusUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly studentRepository: StudentRepository,
    private readonly policy: AccessPolicy,
  ) {}

  async execute(
    actorUser: UserAuthInfo,
    studentId: string,
    status: UserStatusType,
  ) {
    const student = await this.studentRepository.findById(studentId);
    if (!student) throw new NotFoundException('Student does not exist');
    const allowed = this.policy.canStudentManage(actorUser, student);
    if (!allowed) throw new ForbiddenException('Forbidden');
    const user = await this.userRepository.findById(student.getUserId());
    if (!user) throw new NotFoundException('User does not exist');
    user.setStatus(status);
    await this.userRepository.save(user);
  }
}
