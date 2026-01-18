import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/modules/prisma';

import { JsonValue } from './types';

interface ActionTokenData {
  id?: string;
  token: string;
  payload: JsonValue;
  expiredAt?: Date;
  consumedAt?: Date;
}

@Injectable()
export class ActionTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(data: ActionTokenData) {
    return this.prisma.actionToken.upsert({
      where: { token: data.token },
      create: data,
      update: data,
    });
  }

  async findByToken(token: string) {
    return this.prisma.actionToken.findUnique({ where: { token } });
  }

  async update(token: string, data: Partial<ActionTokenData>) {
    return this.prisma.actionToken.update({
      where: { token },
      data,
    });
  }
}
