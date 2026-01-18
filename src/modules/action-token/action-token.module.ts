import { Module } from '@nestjs/common';

import { PrismaModule } from '@/modules/prisma';

import { ActionTokenRepository } from './action-token.repository';
import { ActionTokenService } from './action-token.service';

@Module({
  imports: [PrismaModule],
  providers: [ActionTokenRepository, ActionTokenService],
  exports: [ActionTokenService],
})
export class ActionTokenModule {}
