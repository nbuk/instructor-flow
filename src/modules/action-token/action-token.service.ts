import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';

import {
  ArgumentOutOfRangeException,
  ConflictException,
  NotFoundException,
} from '@/libs/exceptions/exceptions';

import { ActionTokenRepository } from './action-token.repository';
import { JsonValue } from './types';

@Injectable()
export class ActionTokenService {
  constructor(private readonly tokenRepository: ActionTokenRepository) {}

  async create(payload: JsonValue, expiredAt?: Date) {
    const token = nanoid(10);
    await this.tokenRepository.save({
      token,
      payload,
      expiredAt,
    });
    return token;
  }

  async consume<T>(token: string) {
    const action = await this.tokenRepository.findByToken(token);
    if (!action) {
      throw new NotFoundException('action token not found', { token });
    }
    if (action.expiredAt && action.expiredAt.getTime() < Date.now()) {
      throw new ArgumentOutOfRangeException('action token expired', { token });
    }
    if (action.consumedAt) {
      throw new ConflictException('action token already consumed', { token });
    }
    await this.tokenRepository.update(token, { consumedAt: new Date() });
    return action.payload as T;
  }
}
