import { Injectable } from '@nestjs/common';

import { NotFoundException } from '@/libs/exceptions/exceptions';
import { UserAuthInfo } from '@/modules/auth/types';

import { InstructorRepository } from '../repositories/instructor.repository';

@Injectable()
export class AddInstructorGroupChatUseCase {
  constructor(
    private readonly instructorRepository: InstructorRepository,
  ) {}

  async execute(actor: UserAuthInfo, groupChatId: string) {
    const instructor = await this.instructorRepository.findByUserId(actor.id);
    if (!instructor) throw new NotFoundException('Instructor not found');
    instructor.setGroupChatId(groupChatId);
    await this.instructorRepository.save(instructor);
  }
}
