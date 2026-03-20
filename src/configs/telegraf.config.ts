import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModuleAsyncOptions } from 'nestjs-telegraf';
import { SocksProxyAgent } from 'socks-proxy-agent';

export const getTelegrafConfig = (): TelegrafModuleAsyncOptions => ({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const agent = new SocksProxyAgent(config.get('SOCKS_PROXY_URI', ''));

    return {
      token: config.get('BOT_TOKEN', ''),
      options: {
        telegram: {
          agent,
          testEnv: config.get('NODE_ENV', 'development') === 'development',
        },
      },
    };
  },
});
