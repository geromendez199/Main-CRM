import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service.js';
import type { AuthUser } from '../../auth/auth.types.js';
import { PermissionAction } from '@maincrm/shared';
import { AccessControlService } from '../roles/access-control.service.js';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService, private readonly access: AccessControlService) {}

  async list(user: AuthUser, args: { skip?: number; take?: number; orderBy?: Record<string, 'asc' | 'desc'> }) {
    await this.access.assertPermissions(user, [{ action: PermissionAction.READ, resource: 'audit_log' }]);
    const where = { tenantId: user.tenantId };
    const [items, total] = await Promise.all([
      this.prisma.auditLog.findMany({ where, orderBy: args.orderBy, skip: args.skip, take: args.take }),
      this.prisma.auditLog.count({ where })
    ]);
    return { items, total };
  }
}
