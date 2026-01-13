import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { requestContext } from './request-context.js';

interface RequestUser {
  tenantId?: string;
  sub?: string;
  id?: string;
}

@Injectable()
export class RequestContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<{ user?: RequestUser }>();
    if (req?.user) {
      requestContext.update({
        tenantId: req.user.tenantId ?? null,
        userId: req.user.id ?? req.user.sub ?? null
      });
    }
    return next.handle();
  }
}
