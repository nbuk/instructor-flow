import { Injectable } from '@nestjs/common';

import { ActionTokenEntity } from '@/modules/action-token/domain/entities/action-token.entity';

import { ActionTokenPayload } from '../domain/entities/types';
import { ActionTokenRepository } from '../repositories/action-token.repository';

interface CreateTokenParams {
  payload: ActionTokenPayload;
  expiredAt: Date;
  isReusable?: boolean;
  maxUses?: number;
}

@Injectable()
export class CreateTokenUseCase {
  constructor(private readonly repository: ActionTokenRepository) {}

  async execute(params: CreateTokenParams) {
    const token = ActionTokenEntity.create({
      ...params,
      isReusable: params.isReusable ?? false,
      maxUses: params.maxUses ?? null,
    });
    await this.repository.save(token);
    return token.getToken();
  }
}
