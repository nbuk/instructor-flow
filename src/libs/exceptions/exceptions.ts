import { ExceptionBase } from './exception.base';
import {
  ARGUMENT_INVALID,
  ARGUMENT_NOT_PROVIDED,
  ARGUMENT_OUT_OF_RANGE,
  CONFLICT,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} from './exception.codes';

export class ArgumentInvalidException extends ExceptionBase {
  readonly code = ARGUMENT_INVALID;
}

export class ArgumentNotProvidedException extends ExceptionBase {
  readonly code = ARGUMENT_NOT_PROVIDED;
}

export class ArgumentOutOfRangeException extends ExceptionBase {
  readonly code = ARGUMENT_OUT_OF_RANGE;
}

export class ConflictException extends ExceptionBase {
  readonly code = CONFLICT;
}

export class NotFoundException extends ExceptionBase {
  readonly code = NOT_FOUND;
}

export class ForbiddenException extends ExceptionBase {
  readonly code = FORBIDDEN;
}

export class InternalServerErrorException extends ExceptionBase {
  static readonly message = 'Internal server error';
  readonly code = INTERNAL_SERVER_ERROR;

  constructor(message = InternalServerErrorException.message) {
    super(message);
  }
}
