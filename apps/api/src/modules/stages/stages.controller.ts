import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { StagesService } from './stages.service.js';
import { JwtAuthGuard } from '../../auth/jwt.guard.js';
import { PermissionsGuard } from '../roles/permissions.guard.js';
import { RequirePermissions } from '../../common/permissions.decorator.js';
import { PermissionAction, stageCreateSchema, stageUpdateSchema } from '@maincrm/shared';
import { ZodValidationPipe } from '../../common/zod-validation.pipe.js';
import { CurrentUser } from '../users/current-user.decorator.js';
import type { AuthUser } from '../../auth/auth.types.js';
import { toPagination } from '../../common/pagination.js';
import { parseSort } from '../../common/sort.js';

@Controller('api/v1/stages')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class StagesController {
  constructor(private readonly stages: StagesService) {}

  @Get()
  @RequirePermissions({ action: PermissionAction.READ, resource: 'stage' })
  async list(
    @CurrentUser() user: AuthUser,
    @Query() query: { pipelineId?: string; page?: number; limit?: number; sort?: string }
  ) {
    const where = query.pipelineId ? { pipelineId: query.pipelineId } : {};
    const { skip, take, page, limit } = toPagination(query);
    const orderBy = parseSort(query.sort, ['order', 'createdAt'], 'order');
    const { items, total } = await this.stages.listForUser(user, { skip, take, where, orderBy });
    return { data: items, meta: { page, limit, total }, error: null };
  }

  @Get(':id')
  @RequirePermissions({ action: PermissionAction.READ, resource: 'stage' })
  async get(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.stages.getForUser(user, id);
  }

  @Post()
  @RequirePermissions({ action: PermissionAction.CREATE, resource: 'stage' })
  async create(@CurrentUser() user: AuthUser, @Body(new ZodValidationPipe(stageCreateSchema)) body: Record<string, unknown>) {
    return this.stages.createForUser(user, body);
  }

  @Put(':id')
  @RequirePermissions({ action: PermissionAction.UPDATE, resource: 'stage' })
  async update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body(new ZodValidationPipe(stageUpdateSchema)) body: Record<string, unknown>) {
    return this.stages.updateForUser(user, id, body);
  }
}
