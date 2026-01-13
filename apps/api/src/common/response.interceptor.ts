import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import type { Observable } from 'rxjs';
import type { ApiResponse } from '@maincrm/shared';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(_: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object' && 'data' in data && 'meta' in data) {
          const typed = data as ApiResponse<T>;
          return {
            data: typed.data,
            meta: typed.meta ?? null,
            error: typed.error ?? null
          };
        }
        return {
          data,
          meta: null,
          error: null
        };
      })
    );
  }
}
