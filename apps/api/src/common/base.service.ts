import { requestContext } from './request-context.js';
import { AuditAction } from '@maincrm/shared';
import type { PrismaService } from './prisma.service.js';

export class BaseService {
  constructor(protected readonly prisma: PrismaService, protected readonly model: keyof PrismaService) {}

  protected delegate() {
    return (this.prisma as unknown as Record<string, any>)[this.model];
  }

  async list(tenantId: string, args: { skip?: number; take?: number; where?: Record<string, unknown>; orderBy?: Record<string, 'asc' | 'desc'> }) {
    const where = { tenantId, deletedAt: null, ...(args.where ?? {}) };
    const [items, total] = await Promise.all([
      this.delegate().findMany({
        where,
        skip: args.skip,
        take: args.take,
        orderBy: args.orderBy
      }),
      this.delegate().count({ where })
    ]);
    return { items, total };
  }

  async findById(tenantId: string, id: string) {
    return this.delegate().findFirst({ where: { tenantId, id, deletedAt: null } });
  }

  async create(tenantId: string, data: Record<string, unknown>) {
    return this.delegate().create({ data: { ...data, tenantId } });
  }

  async update(tenantId: string, id: string, data: Record<string, unknown>) {
    return this.delegate().update({ where: { id }, data: { ...data, tenantId } });
  }

  async softDelete(tenantId: string, id: string) {
    requestContext.setAuditAction(AuditAction.DELETE);
    const result = await this.delegate().update({ where: { id }, data: { deletedAt: new Date(), tenantId } });
    requestContext.setAuditAction(undefined);
    return result;
  }

  async restore(tenantId: string, id: string) {
    requestContext.setAuditAction(AuditAction.RESTORE);
    const result = await this.delegate().update({ where: { id }, data: { deletedAt: null, tenantId } });
    requestContext.setAuditAction(undefined);
    return result;
  }
}
