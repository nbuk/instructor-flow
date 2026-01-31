import { Module } from '@nestjs/common';

import { PrismaModule } from '@/modules/prisma';

import { ActionTokenRepository } from './repositories/action-token.repository';
import { useCases } from './use-cases';
import { ConsumeTokenUseCase } from './use-cases/consume-token.use-case';
import { CreateTokenUseCase } from './use-cases/create-token.use-case';

@Module({
  imports: [PrismaModule],
  providers: [ActionTokenRepository, ...useCases],
  exports: [ConsumeTokenUseCase, CreateTokenUseCase],
})
export class ActionTokenModule {}
