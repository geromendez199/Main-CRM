import { BaseService } from './base.service.js';
import type { PrismaService } from './prisma.service.js';
import type { AccessControlService } from '../modules/roles/access-control.service.js';
import type { AuthUser } from '../auth/auth.types.js';
import { PermissionAction } from '@maincrm/shared';

export class SecureService extends BaseService {
  constructor(
    prisma: PrismaService,
    model: keyof PrismaService,
    protected readonly access: AccessControlService,
    protected readonly resource: string
  ) {
    super(prisma, model);
  }

  async listForUser(user: AuthUser, args: { skip?: number; take?: number; where?: Record<string, unknown>; orderBy?: Record<string, 'asc' | 'desc'> }) {
    await this.access.assertPermissions(user, [{ action: PermissionAction.READ, resource: this.resource }]);
    return this.list(user.tenantId, args);
  }

  async getForUser(user: AuthUser, id: string) {
    await this.access.assertPermissions(user, [{ action: PermissionAction.READ, resource: this.resource }]);
    return this.findById(user.tenantId, id);
  }

  async createForUser(user: AuthUser, data: Record<string, unknown>) {
    await this.access.assertPermissions(user, [{ action: PermissionAction.CREATE, resource: this.resource }]);
    return this.create(user.tenantId, data);
  }

  async updateForUser(user: AuthUser, id: string, data: Record<string, unknown>) {
    await this.access.assertPermissions(user, [{ action: PermissionAction.UPDATE, resource: this.resource }]);
    return this.update(user.tenantId, id, data);
  }

  async deleteForUser(user: AuthUser, id: string) {
    await this.access.assertPermissions(user, [{ action: PermissionAction.DELETE, resource: this.resource }]);
    return this.softDelete(user.tenantId, id);
  }

  async restoreForUser(user: AuthUser, id: string) {
    await this.access.assertPermissions(user, [{ action: PermissionAction.UPDATE, resource: this.resource }]);
    return this.restore(user.tenantId, id);
  }
}
