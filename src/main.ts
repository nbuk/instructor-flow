import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { config } from 'dotenv';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';

dayjs.extend(utc);
dayjs.extend(timezone);
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  app.enableCors({
    origin: [process.env.WEB_APP_HOST],
    credentials: true,
  });
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
