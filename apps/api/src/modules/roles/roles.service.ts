import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service.js';
import type { AuthUser } from '../../auth/auth.types.js';
import { PermissionAction } from '@maincrm/shared';
import { AccessControlService } from './access-control.service.js';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService, private readonly access: AccessControlService) {}

  async list(user: AuthUser, args: { skip?: number; take?: number; orderBy?: Record<string, 'asc' | 'desc'> }) {
    await this.access.assertPermissions(user, [{ action: PermissionAction.READ, resource: 'role' }]);
    const where = { tenantId: user.tenantId, deletedAt: null };
    const [items, total] = await Promise.all([
      this.prisma.role.findMany({ where, include: { permissions: true }, skip: args.skip, take: args.take, orderBy: args.orderBy }),
      this.prisma.role.count({ where })
    ]);
    return { items, total };
  }
}
