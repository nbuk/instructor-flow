type ExceptionMetadata<T extends object = Record<string, unknown>> = {
  clientMessage?: string;
} & T;

export interface SerializedException {
  message: string;
  code: string;
  stack?: string;
  cause?: string;
  metadata?: ExceptionMetadata;
}

export abstract class ExceptionBase extends Error {
  abstract code: string;

  constructor(
    readonly message: string,
    readonly metadata?: ExceptionMetadata,
    readonly cause?: Error,
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON(): SerializedException {
    return {
      message: this.message,
      code: this.code,
      stack: this.stack,
      cause: JSON.stringify(this.cause),
      metadata: this.metadata,
    };
  }
}
