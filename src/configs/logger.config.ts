import { IncomingMessage } from 'node:http';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModuleAsyncParams } from 'nestjs-pino';
import path from 'path';

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
        transport: isDev
          ? {
              target: 'pino-pretty',
              options: {
                colorize: true,
                singleLine: true,
              },
            }
          : {
              targets: [
                { target: 'pino/file', options: { destination: 1 } },
                {
                  target: 'pino-roll',
                  options: {
                    file: path.join(
                      config.get('LOGS_DIR_PATH', ''),
                      'prod.log',
                    ),
                    frequency: 'daily',
                    size: '20m',
                    mkdir: true,
                    extension: '.log',
                  },
                },
              ],
            },
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
