import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import {
  Paginated,
  PaginatedQueryParams,
  RepositoryBase,
} from '@/libs/database/repository.base';
import { PrismaService } from '@/modules/prisma';
import { PrismaTx } from '@/modules/prisma/prisma.service';

import { UserEntity } from '../domain/entities/user';

@Injectable()
export class UserRepository extends RepositoryBase<UserEntity> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super();
  }

  async save(entity: UserEntity): Promise<void> {
    const data = entity.serialize();
    await this.prisma.user.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
    await entity.publishEvents(new Logger(), this.eventEmitter);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return UserEntity.restore(user);
  }

  async findByTgId(tgId: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { tgId } });
    if (!user) return null;
    return UserEntity.restore(user);
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => UserEntity.restore(user));
  }

  async findAllPaginated(
    params: PaginatedQueryParams,
  ): Promise<Paginated<UserEntity>> {
    const { limit, offset, orderBy } = params;
    const users = await this.prisma.user.findMany({
      orderBy: { [orderBy.field]: orderBy.param },
      take: limit,
      skip: offset,
    });
    const totalCount = await this.prisma.user.count();
    return {
      limit,
      offset,
      totalCount,
      data: users.map((user) => UserEntity.restore(user)),
    };
  }

  async delete(entity: UserEntity): Promise<boolean> {
    const user = await this.prisma.user.delete({
      where: { id: entity.getId() },
    });
    await entity.publishEvents(new Logger(), this.eventEmitter);
    return !!user;
  }
}

export class UserRepositoryTx extends UserRepository {
  constructor(tx: PrismaTx, eventEmitter: EventEmitter2) {
    super(tx as PrismaService, eventEmitter);
  }
}
