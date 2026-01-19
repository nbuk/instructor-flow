import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';

import { SessionRepository } from '../repositories/session.repository';

@Injectable()
export class CreateSessionUseCase {
  constructor(private readonly sessionRepository: SessionRepository) {}

  async execute(userId: string) {
    const code = nanoid(10);

    return this.sessionRepository.create({
      code,
      userId,
      expiredAt: dayjs().add(1, 'month').toDate(),
    });
  }
}
