import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { UserRole } from '@/modules/user/domain/entities/user';

@Injectable()
export class InstructorGuard implements CanActivate {
  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // TODO: добавить проверку для telegraf ExecutionContext
    const req = ctx.switchToHttp().getRequest();
    return req.user?.role === UserRole.INSTRUCTOR;
  }
}
