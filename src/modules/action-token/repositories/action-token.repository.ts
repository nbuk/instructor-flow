import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/modules/prisma';

import { ActionTokenEntity } from '../domain/entities/action-token.entity';
import { IActionToken } from '../domain/entities/types';

@Injectable()
export class ActionTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(entity: ActionTokenEntity) {
    const data = entity.serialize();
    return this.prisma.actionToken.upsert({
      where: { token: data.token },
      create: { ...data, payload: data.payload as object },
      update: { ...data, payload: data.payload as object },
    });
  }

  async findByToken(token: string) {
    const data = await this.prisma.actionToken.findUnique({ where: { token } });
    if (!data) return null;
    return ActionTokenEntity.restore(data as IActionToken);
  }
}
