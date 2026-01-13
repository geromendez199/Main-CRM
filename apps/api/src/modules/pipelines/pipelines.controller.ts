import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { PipelinesService } from './pipelines.service.js';
import { JwtAuthGuard } from '../../auth/jwt.guard.js';
import { PermissionsGuard } from '../roles/permissions.guard.js';
import { RequirePermissions } from '../../common/permissions.decorator.js';
import { PermissionAction, pipelineCreateSchema, pipelineUpdateSchema } from '@maincrm/shared';
import { ZodValidationPipe } from '../../common/zod-validation.pipe.js';
import { CurrentUser } from '../users/current-user.decorator.js';
import type { AuthUser } from '../../auth/auth.types.js';
import { toPagination } from '../../common/pagination.js';
import { parseSort } from '../../common/sort.js';

@Controller('api/v1/pipelines')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PipelinesController {
  constructor(private readonly pipelines: PipelinesService) {}

  @Get()
  @RequirePermissions({ action: PermissionAction.READ, resource: 'pipeline' })
  async list(@CurrentUser() user: AuthUser, @Query() query: { page?: number; limit?: number; sort?: string }) {
    const { skip, take, page, limit } = toPagination(query);
    const orderBy = parseSort(query.sort, ['name', 'createdAt'], 'createdAt');
    const { items, total } = await this.pipelines.listForUser(user, { skip, take, orderBy });
    return { data: items, meta: { page, limit, total }, error: null };
  }

  @Get(':id')
  @RequirePermissions({ action: PermissionAction.READ, resource: 'pipeline' })
  async get(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.pipelines.getForUser(user, id);
  }

  @Post()
  @RequirePermissions({ action: PermissionAction.CREATE, resource: 'pipeline' })
  async create(@CurrentUser() user: AuthUser, @Body(new ZodValidationPipe(pipelineCreateSchema)) body: Record<string, unknown>) {
    return this.pipelines.createForUser(user, body);
  }

  @Put(':id')
  @RequirePermissions({ action: PermissionAction.UPDATE, resource: 'pipeline' })
  async update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body(new ZodValidationPipe(pipelineUpdateSchema)) body: Record<string, unknown>) {
    return this.pipelines.updateForUser(user, id, body);
  }
}
