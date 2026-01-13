import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service.js';
import { JwtAuthGuard } from '../../auth/jwt.guard.js';
import { PermissionsGuard } from '../roles/permissions.guard.js';
import { RequirePermissions } from '../../common/permissions.decorator.js';
import { PermissionAction } from '@maincrm/shared';
import { CurrentUser } from '../users/current-user.decorator.js';
import type { AuthUser } from '../../auth/auth.types.js';
import { toPagination } from '../../common/pagination.js';
import { parseSort } from '../../common/sort.js';

@Controller('api/v1/permissions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PermissionsController {
  constructor(private readonly permissions: PermissionsService) {}

  @Get()
  @RequirePermissions({ action: PermissionAction.READ, resource: 'permission' })
  async list(@CurrentUser() user: AuthUser, @Query() query: { page?: number; limit?: number; sort?: string }) {
    const { skip, take, page, limit } = toPagination(query);
    const orderBy = parseSort(query.sort, ['resource', 'action'], 'resource');
    const { items, total } = await this.permissions.list(user, { skip, take, orderBy });
    return { data: items, meta: { page, limit, total }, error: null };
  }
}
