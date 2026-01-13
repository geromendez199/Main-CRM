import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service.js';
import { SecureService } from '../../common/secure.service.js';
import { AccessControlService } from '../roles/access-control.service.js';
import { AutomationService } from '../automation/automation.service.js';
import type { AuthUser } from '../../auth/auth.types.js';
import { PermissionAction } from '@maincrm/shared';

@Injectable()
export class DealsService extends SecureService {
  constructor(prisma: PrismaService, access: AccessControlService, private readonly automation: AutomationService) {
    super(prisma, 'deal', access, 'deal');
  }

  async updateForUser(user: AuthUser, id: string, data: Record<string, unknown>) {
    await this.access.assertPermissions(user, [{ action: PermissionAction.UPDATE, resource: 'deal' }]);
    const updated = await this.update(user.tenantId, id, data);
    if (data.stageId) {
      const stage = await this.prisma.stage.findFirst({
        where: { id: data.stageId as string, tenantId: user.tenantId, deletedAt: null }
      });
      if (stage?.key === 'WON') {
        await this.automation.enqueueDealWon(user.tenantId, updated.id);
      }
    }
    return updated;
  }
}
