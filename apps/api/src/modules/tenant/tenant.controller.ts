import { Controller, Get, UseGuards } from '@nestjs/common';
import { TenantService } from './tenant.service.js';
import { JwtAuthGuard } from '../../auth/jwt.guard.js';
import { PermissionsGuard } from '../roles/permissions.guard.js';
import { RequirePermissions } from '../../common/permissions.decorator.js';
import { PermissionAction } from '@maincrm/shared';
import { CurrentUser } from '../users/current-user.decorator.js';
import type { AuthUser } from '../../auth/auth.types.js';

@Controller('api/v1/tenant')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TenantController {
  constructor(private readonly tenants: TenantService) {}

  @Get('me')
  @RequirePermissions({ action: PermissionAction.READ, resource: 'tenant' })
  async me(@CurrentUser() user: AuthUser) {
    return this.tenants.getCurrent(user);
  }
}
