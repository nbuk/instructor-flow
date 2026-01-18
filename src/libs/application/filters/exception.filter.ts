import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { TelegrafArgumentsHost, TelegrafException } from 'nestjs-telegraf';

import { ExceptionBase } from '@/libs/exceptions/exception.base';
import {
  ArgumentInvalidException,
  ArgumentNotProvidedException,
  ArgumentOutOfRangeException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@/libs/exceptions/exceptions';
import { TelegrafContext } from '@/modules/auth/types';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  async catch(exception: any, host: ArgumentsHost) {
    const type = host.getType();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (type === 'telegraf') {
      const telegrafHost = TelegrafArgumentsHost.create(host);
      const ctx = telegrafHost.getContext<TelegrafContext>();
      this.logger.error(exception, exception.stack);
      if (
        exception instanceof ExceptionBase &&
        exception.metadata?.clientMessage
      ) {
        await ctx.reply(exception.metadata.clientMessage);
        return;
      }
      await ctx.reply('Что-то пошло не так');
      return;
    }

    const response = host.switchToHttp().getResponse();

    const isHttpException = exception instanceof HttpException;
    const isDomainException = exception instanceof ExceptionBase;

    if (isHttpException) {
      response.status(exception.getStatus()).json(exception.getResponse());
      return;
    }

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = exception.message;

    if (!isDomainException) {
      this.logger.error(exception, exception.stack);
      message = 'internal server error';
    }

    if (exception instanceof ArgumentInvalidException) {
      status = HttpStatus.BAD_REQUEST;
    }

    if (exception instanceof ArgumentNotProvidedException) {
      status = HttpStatus.BAD_REQUEST;
    }

    if (exception instanceof ArgumentOutOfRangeException) {
      status = HttpStatus.BAD_REQUEST;
    }

    if (exception instanceof ConflictException) {
      status = HttpStatus.CONFLICT;
    }

    if (exception instanceof NotFoundException) {
      status = HttpStatus.NOT_FOUND;
    }

    if (exception instanceof InternalServerErrorException) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'internal server error';
    }

    response.status(status).json({ error: true, message });
  }
}
