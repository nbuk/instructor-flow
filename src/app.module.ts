import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TelegrafModule } from 'nestjs-telegraf';

import { getServeStaticConfig } from '@/configs/serve-static.config';
import { getTelegrafConfig } from '@/configs/telegraf.config';
import { GlobalExceptionFilter } from '@/libs/application/filters/exception.filter';

import { AuthModule } from './modules/auth';
import { LessonModule } from './modules/lesson';
import { UserModule } from './modules/user';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot(getServeStaticConfig()),
    TelegrafModule.forRootAsync(getTelegrafConfig()),
    EventEmitterModule.forRoot(),
    UserModule,
    LessonModule,
    AuthModule,
  ],
  controllers: [],
  providers: [{ provide: APP_FILTER, useClass: GlobalExceptionFilter }],
})
export class AppModule {}
