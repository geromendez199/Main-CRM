import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { ExecutionContext } from '@nestjs/common';
import { requestContext } from '../common/request-context.js';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(err: unknown, user: TUser, info: unknown, context: ExecutionContext): TUser {
    const request = context.switchToHttp().getRequest();
    if (user) {
      request.user = { ...user, id: user.sub };
      requestContext.update({ tenantId: user.tenantId, userId: user.sub });
    }
    return super.handleRequest(err, user, info, context);
  }
}
