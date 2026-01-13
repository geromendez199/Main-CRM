import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AccountsService } from './accounts.service.js';
import { JwtAuthGuard } from '../../auth/jwt.guard.js';
import { PermissionsGuard } from '../roles/permissions.guard.js';
import { RequirePermissions } from '../../common/permissions.decorator.js';
import { PermissionAction } from '@maincrm/shared';
import { ZodValidationPipe } from '../../common/zod-validation.pipe.js';
import { accountCreateSchema, accountUpdateSchema } from '@maincrm/shared';
import type { AuthUser } from '../../auth/auth.types.js';
import { CurrentUser } from '../users/current-user.decorator.js';
import { toPagination } from '../../common/pagination.js';
import { parseSort } from '../../common/sort.js';

@Controller('api/v1/accounts')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AccountsController {
  constructor(private readonly accounts: AccountsService) {}

  @Get()
  @RequirePermissions({ action: PermissionAction.READ, resource: 'account' })
  async list(
    @CurrentUser() user: AuthUser,
    @Query() query: { page?: number; limit?: number; q?: string; ownerId?: string; sort?: string }
  ) {
    const { skip, take, page, limit } = toPagination(query);
    const orderBy = parseSort(query.sort, ['name', 'createdAt', 'updatedAt'], 'createdAt');
    const where: Record<string, unknown> = {};
    if (query.q) {
      where.name = { contains: query.q, mode: 'insensitive' };
    }
    if (query.ownerId) {
      where.ownerId = query.ownerId;
    }
    const { items, total } = await this.accounts.listForUser(user, { skip, take, where, orderBy });
    return { data: items, meta: { page, limit, total }, error: null };
  }

  @Get(':id')
  @RequirePermissions({ action: PermissionAction.READ, resource: 'account' })
  async get(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.accounts.getForUser(user, id);
  }

  @Post()
  @RequirePermissions({ action: PermissionAction.CREATE, resource: 'account' })
  async create(@CurrentUser() user: AuthUser, @Body(new ZodValidationPipe(accountCreateSchema)) body: Record<string, unknown>) {
    return this.accounts.createForUser(user, body);
  }

  @Put(':id')
  @RequirePermissions({ action: PermissionAction.UPDATE, resource: 'account' })
  async update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body(new ZodValidationPipe(accountUpdateSchema)) body: Record<string, unknown>) {
    return this.accounts.updateForUser(user, id, body);
  }
}
