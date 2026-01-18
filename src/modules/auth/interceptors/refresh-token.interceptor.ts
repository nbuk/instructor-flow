import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import dayjs from 'dayjs';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class RefreshTokenInterceptor implements NestInterceptor {
  constructor(private readonly config: ConfigService) {}

  intercept(
    ctx: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const res: Response = ctx.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data: { accessToken: string; refreshToken?: string }) => {
        if (data?.refreshToken) {
          res.cookie('refreshToken', data.refreshToken, {
            httpOnly: true,
            secure:
              this.config.get('NODE_ENV', 'development') !== 'development',
            sameSite: 'lax',
            path: '/api/auth/refresh',
            maxAge: dayjs().add(1, 'month').unix(),
          });

          delete data.refreshToken;
        }

        return data;
      }),
    );
  }
}
