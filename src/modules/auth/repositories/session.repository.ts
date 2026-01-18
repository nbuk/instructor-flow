import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/modules/prisma';

import { ISession } from '../types';

@Injectable()
export class SessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    session: Omit<ISession, 'id' | 'user' | 'createdAt' | 'updatedAt'>,
  ) {
    return this.prisma.session.create({
      data: session,
      include: { user: true },
    });
  }

  async update(
    id: string,
    session: Partial<Omit<ISession, 'id' | 'user' | 'createdAt' | 'updatedAt'>>,
  ) {
    return this.prisma.session.update({
      where: { id },
      data: session,
      include: { user: true },
    });
  }

  async findByCode(code: string) {
    return this.prisma.session.findUnique({
      where: { code },
      include: { user: true },
    });
  }
}
