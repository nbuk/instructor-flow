import { Injectable } from '@nestjs/common';

import { NotFoundException } from '@/libs/exceptions/exceptions';

import { ActionTokenRepository } from '../repositories/action-token.repository';

@Injectable()
export class ConsumeTokenUseCase {
  constructor(private readonly repository: ActionTokenRepository) {}

  async execute<T>(token: string): Promise<T> {
    const action = await this.repository.findByToken(token);
    if (!action) {
      throw new NotFoundException('action token not found', { token });
    }
    const payload = action.consume<T>();
    await this.repository.save(action);
    return payload;
  }
}
