import { Injectable, NestMiddleware } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import type { Request, Response, NextFunction } from 'express';
import { REQUEST_ID_HEADER } from '@maincrm/shared';
import { requestContext } from './request-context.js';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const requestId = req.header(REQUEST_ID_HEADER) ?? uuidv4();
    res.setHeader(REQUEST_ID_HEADER, requestId);
    const tenantId = (req as Request & { user?: { tenantId?: string } }).user?.tenantId ?? null;
    const userId = (req as Request & { user?: { sub?: string; id?: string } }).user?.id ?? null;
    requestContext.run(
      {
        requestId,
        tenantId,
        userId,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] ?? null
      },
      () => next()
    );
  }
}
