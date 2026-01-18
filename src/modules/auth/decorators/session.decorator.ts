import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const Session = createParamDecorator((_, ctx) => {
  const req: Request = ctx.switchToHttp().getRequest();
  return 'session' in req ? req.session : null;
});
