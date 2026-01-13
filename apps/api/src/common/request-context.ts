import { AsyncLocalStorage } from 'node:async_hooks';
import type { AuditAction } from '@maincrm/shared';

export interface RequestContextData {
  requestId: string;
  tenantId: string | null;
  userId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  auditActionOverride?: AuditAction;
}

const storage = new AsyncLocalStorage<RequestContextData>();

export const requestContext = {
  run<T>(context: RequestContextData, fn: () => T): T {
    return storage.run(context, fn);
  },
  get(): RequestContextData | undefined {
    return storage.getStore();
  },
  update(partial: Partial<RequestContextData>): void {
    const current = storage.getStore();
    if (current) {
      Object.assign(current, partial);
    }
  },
  setAuditAction(action?: AuditAction): void {
    const current = storage.getStore();
    if (current) {
      current.auditActionOverride = action;
    }
  }
};
