import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { DealsService } from './deals.service.js';
import { JwtAuthGuard } from '../../auth/jwt.guard.js';
import { PermissionsGuard } from '../roles/permissions.guard.js';
import { RequirePermissions } from '../../common/permissions.decorator.js';
import { PermissionAction, dealCreateSchema, dealUpdateSchema } from '@maincrm/shared';
import { ZodValidationPipe } from '../../common/zod-validation.pipe.js';
import { CurrentUser } from '../users/current-user.decorator.js';
import type { AuthUser } from '../../auth/auth.types.js';
import { toPagination } from '../../common/pagination.js';
import { parseSort } from '../../common/sort.js';

@Controller('api/v1/deals')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DealsController {
  constructor(private readonly deals: DealsService) {}

  @Get()
  @RequirePermissions({ action: PermissionAction.READ, resource: 'deal' })
  async list(
    @CurrentUser() user: AuthUser,
    @Query() query: { page?: number; limit?: number; q?: string; ownerId?: string; accountId?: string; stageId?: string; sort?: string }
  ) {
    const { skip, take, page, limit } = toPagination(query);
    const orderBy = parseSort(query.sort, ['name', 'createdAt', 'updatedAt', 'value'], 'updatedAt');
    const where: Record<string, unknown> = {};
    if (query.q) {
      where.name = { contains: query.q, mode: 'insensitive' };
    }
    if (query.ownerId) {
      where.ownerId = query.ownerId;
    }
    if (query.accountId) {
      where.accountId = query.accountId;
    }
    if (query.stageId) {
      where.stageId = query.stageId;
    }
    const { items, total } = await this.deals.listForUser(user, { skip, take, where, orderBy });
    return { data: items, meta: { page, limit, total }, error: null };
  }

  @Get(':id')
  @RequirePermissions({ action: PermissionAction.READ, resource: 'deal' })
  async get(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.deals.getForUser(user, id);
  }

  @Post()
  @RequirePermissions({ action: PermissionAction.CREATE, resource: 'deal' })
  async create(@CurrentUser() user: AuthUser, @Body(new ZodValidationPipe(dealCreateSchema)) body: Record<string, unknown>) {
    return this.deals.createForUser(user, body);
  }

  @Put(':id')
  @RequirePermissions({ action: PermissionAction.UPDATE, resource: 'deal' })
  async update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body(new ZodValidationPipe(dealUpdateSchema)) body: Record<string, unknown>) {
    return this.deals.updateForUser(user, id, body);
  }
}
