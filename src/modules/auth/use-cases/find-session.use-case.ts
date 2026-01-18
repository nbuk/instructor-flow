import { Injectable } from '@nestjs/common';

import { SessionRepository } from '@/modules/auth/repositories/session.repository';

@Injectable()
export class FindSessionUseCase {
  constructor(private readonly sessionRepository: SessionRepository) {}

  async execute(code: string) {
    return this.sessionRepository.findByCode(code);
  }
}
