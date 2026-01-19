import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModuleAsyncOptions } from 'nestjs-telegraf';

export const getTelegrafConfig = (): TelegrafModuleAsyncOptions => ({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    token: config.get('BOT_TOKEN', ''),
    options: {
      telegram: {
        testEnv: config.get('NODE_ENV', 'development') === 'development',
      },
    },
  }),
});
