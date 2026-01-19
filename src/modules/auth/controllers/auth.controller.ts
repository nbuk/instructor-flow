import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';

import { PublicRoute } from '../decorators/public-route.decorator';
import { Session } from '../decorators/session.decorator';
import { User } from '../decorators/user.decorator';
import { RefreshTokenGuard } from '../guards/refresh-token.guard';
import { TMAGuard } from '../guards/tma.guard';
import { RefreshTokenInterceptor } from '../interceptors/refresh-token.interceptor';
import { type ISession, type UserAuthInfo } from '../types';
import { CreateSessionUseCase } from '../use-cases/create-session.use-case';
import { LoginUseCase } from '../use-cases/login.use-case';
import { RefreshTokenUseCase } from '../use-cases/refresh-token.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly createSessionUseCase: CreateSessionUseCase,
  ) {}

  @Get('tma')
  @PublicRoute()
  @UseGuards(TMAGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  async loginViaTMA(@User() user: UserAuthInfo) {
    const session = await this.createSessionUseCase.execute(user.id);
    return this.loginUseCase.execute(
      user.id,
      user.role,
      session.code,
      session.expiredAt,
    );
  }

  @Get('refresh')
  @PublicRoute()
  @UseGuards(RefreshTokenGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  async refreshToken(@Session() session: ISession) {
    const { user, code, expiredAt } =
      await this.refreshTokenUseCase.execute(session);
    return this.loginUseCase.execute(user.id, user.role, code, expiredAt);
  }
}
