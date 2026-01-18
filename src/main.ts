import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { config } from 'dotenv';

dayjs.extend(utc);
dayjs.extend(timezone);

import { AppModule } from './app.module';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://192.168.0.244:5173'],
    credentials: true,
  });
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
