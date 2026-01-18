import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';

import { PublicRoute } from '../decorators/public-route.decorator';
import { Session } from '../decorators/session.decorator';
import { User } from '../decorators/user.decorator';
import { RefreshTokenGuard } from '../guards/refresh-token.guard';
import { TMAGuard } from '../guards/tma.guard';
import { RefreshTokenInterceptor } from '../interceptors/refresh-token.interceptor';
import { type ISession, type UserAuthInfo } from '../types';
import { LoginUseCase } from '../use-cases/login.use-case';
import { RefreshTokenUseCase } from '../use-cases/refresh-token.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  @Get('tma')
  @PublicRoute()
  @UseGuards(TMAGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  async loginViaTMA(@User() user: UserAuthInfo) {
    return this.loginUseCase.execute(user.id, user.role);
  }

  @Get('refresh')
  @PublicRoute()
  @UseGuards(RefreshTokenGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  async refreshToken(@Session() session: ISession) {
    const { userId, role } = await this.refreshTokenUseCase.execute(session);
    return this.loginUseCase.execute(userId, role);
  }
}
