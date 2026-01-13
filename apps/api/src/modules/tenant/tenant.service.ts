import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service.js';
import type { AuthUser } from '../../auth/auth.types.js';
import { AccessControlService } from '../roles/access-control.service.js';
import { PermissionAction } from '@maincrm/shared';

@Injectable()
export class TenantService {
  constructor(private readonly prisma: PrismaService, private readonly access: AccessControlService) {}

  async getCurrent(user: AuthUser) {
    await this.access.assertPermissions(user, [{ action: PermissionAction.READ, resource: 'tenant' }]);
    return this.prisma.tenant.findFirst({ where: { id: user.tenantId, deletedAt: null } });
  }
}
