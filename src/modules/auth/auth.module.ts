import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { getJwtConfig } from '@/configs/jwt.config';
import { AuthIntegrationModule } from '@/modules/integration/auth';
import { PrismaModule } from '@/modules/prisma';

import { AuthController } from './controllers/auth.controller';
import { ChatAuthGuard } from './guards/chat-auth.guard';
import { JwtGuard } from './guards/jwt.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { TMAGuard } from './guards/tma.guard';
import { SessionRepository } from './repositories/session.repository';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { TMAStrategy } from './strategies/tma.strategy';
import { authUseCases } from './use-cases';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync(getJwtConfig()),
    AuthIntegrationModule,
  ],
  providers: [
    TMAGuard,
    RefreshTokenGuard,
    ChatAuthGuard,
    TMAStrategy,
    JwtRefreshStrategy,
    JwtStrategy,
    SessionRepository,
    { provide: APP_GUARD, useClass: JwtGuard },
    ...authUseCases,
  ],
  controllers: [AuthController],
  exports: [ChatAuthGuard, AuthIntegrationModule],
})
export class AuthModule {}
