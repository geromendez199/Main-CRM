import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service.js';
import type { PermissionRequirement } from '../../common/permissions.decorator.js';
import type { AuthUser } from '../../auth/auth.types.js';

@Injectable()
export class AccessControlService {
  constructor(private readonly prisma: PrismaService) {}

  async assertPermissions(user: AuthUser, requirements: PermissionRequirement[]): Promise<void> {
    const role = await this.prisma.role.findFirst({
      where: { tenantId: user.tenantId, name: user.role },
      include: { permissions: { include: { permission: true } } }
    });

    const permissions = new Set(
      role?.permissions.map((rp) => `${rp.permission.resource}:${rp.permission.action}`) ?? []
    );

    const missing = requirements.filter((req) => !permissions.has(`${req.resource}:${req.action}`));
    if (missing.length > 0) {
      throw new ForbiddenException('Insufficient permissions');
    }
  }
}
