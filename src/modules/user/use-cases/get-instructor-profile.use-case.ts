import { Injectable } from '@nestjs/common';

import {
  ForbiddenException,
  NotFoundException,
} from '@/libs/exceptions/exceptions';
import { UserAuthInfo } from '@/modules/auth/types';

import { AccessPolicy } from '../policies/access.policy';
import { InstructorRepository } from '../repositories/instructor.repository';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class GetInstructorProfileUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly instructorRepository: InstructorRepository,
    private readonly policy: AccessPolicy,
  ) {}

  async execute(actor: UserAuthInfo, instructorId: string) {
    const instructor = await this.instructorRepository.findById(instructorId);
    if (!instructor) throw new NotFoundException('instructor not found');
    const allowed = this.policy.canGetInstructorProfile(actor, instructor);
    if (!allowed) throw new ForbiddenException('forbidden');
    const user = await this.userRepository.findById(instructor?.getUserId());
    if (!user) throw new NotFoundException('user not found');
    return { ...user, profile: instructor.serialize() };
  }
}
