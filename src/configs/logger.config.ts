import { IncomingMessage } from 'node:http';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModuleAsyncParams } from 'nestjs-pino';

import { UserAuthInfo } from '@/modules/auth/types';

export const getLoggerConfig = (): LoggerModuleAsyncParams => ({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const isDev = config.get('NODE_ENV', 'development') === 'development';
    return {
      pinoHttp: {
        level: isDev ? 'debug' : 'info',
        autoLogging: true,
        transport: isDev ? { target: 'pino-pretty' } : undefined,
        redact: {
          paths: ['req.headers.authorization'],
          censor: '[HIDDEN]',
        },
        customProps: (req: IncomingMessage & { user?: UserAuthInfo }) => ({
          user: req.user,
        }),
      },
    };
  },
});
