import { Injectable } from '@nestjs/common';

import { ForbiddenException } from '@/libs/exceptions/exceptions';

import { LessonAccessPolicy } from '../policies/lesson-access.policy';
import { LessonRequestReadRepository } from '../repositories/lesson-request-read.repository';

@Injectable()
export class GetInstructorLessonRequestsUseCase {
  constructor(
    private readonly requestsRepository: LessonRequestReadRepository,
    private readonly policy: LessonAccessPolicy,
  ) {}

  async execute(actorId: string, instructorId: string) {
    const allowed = await this.policy.canGetInstructorRequests(
      actorId,
      instructorId,
    );
    if (!allowed) {
      throw new ForbiddenException('Only instructors can get requests');
    }
    return this.requestsRepository.getInstructorPendingRequests(instructorId);
  }
}
