import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AuditAction } from '@maincrm/shared';
import { requestContext } from './request-context.js';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.$use(async (params, next) => {
      const model = params.model;
      if (!model || model === 'AuditLog') {
        return next(params);
      }

      const action = params.action;
      const isWrite = ['create', 'update', 'delete', 'upsert'].includes(action);
      if (!isWrite) {
        return next(params);
      }

      const ctx = requestContext.get();
      const requestId = ctx?.requestId ?? 'system';
      const actorUserId = ctx?.userId ?? null;
      const ipAddress = ctx?.ipAddress ?? null;
      const userAgent = ctx?.userAgent ?? null;

      const delegateKey = model.charAt(0).toLowerCase() + model.slice(1);
      const delegate = (this as unknown as Record<string, { findUnique: (args: unknown) => Promise<unknown> }>)[
        delegateKey
      ];

      let before: unknown = null;
      if (action !== 'create' && delegate?.findUnique) {
        const where = (params.args as { where?: Record<string, unknown> }).where;
        if (where) {
          before = await delegate.findUnique({ where });
        }
      }

      const result = await next(params);

      const after = result;
      const tenantId =
        (after as { tenantId?: string })?.tenantId ??
        (before as { tenantId?: string })?.tenantId ??
        (params.args as { data?: { tenantId?: string } })?.data?.tenantId ??
        ctx?.tenantId ??
        null;

      if (!tenantId) {
        return result;
      }

      let auditAction: AuditAction;
      if (action === 'create') {
        auditAction = AuditAction.CREATE;
      } else if (action === 'delete') {
        auditAction = AuditAction.DELETE;
      } else {
        auditAction = ctx?.auditActionOverride ?? AuditAction.UPDATE;
      }

      await this.auditLog.create({
        data: {
          tenantId,
          actorUserId,
          entityType: model,
          entityId: (after as { id?: string })?.id ?? (before as { id?: string })?.id ?? 'unknown',
          action: auditAction,
          beforeJson: before ?? undefined,
          afterJson: after ?? undefined,
          requestId,
          ipAddress,
          userAgent
        }
      });

      return result;
    });
  }
}
