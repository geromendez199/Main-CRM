import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { JwtAuthGuard } from '../../auth/jwt.guard.js';
import { PermissionsGuard } from '../roles/permissions.guard.js';
import { RequirePermissions } from '../../common/permissions.decorator.js';
import { PermissionAction, taskCreateSchema, taskUpdateSchema } from '@maincrm/shared';
import { ZodValidationPipe } from '../../common/zod-validation.pipe.js';
import { CurrentUser } from '../users/current-user.decorator.js';
import type { AuthUser } from '../../auth/auth.types.js';
import { toPagination } from '../../common/pagination.js';
import { parseSort } from '../../common/sort.js';

@Controller('api/v1/tasks')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  @Get()
  @RequirePermissions({ action: PermissionAction.READ, resource: 'task' })
  async list(
    @CurrentUser() user: AuthUser,
    @Query() query: { page?: number; limit?: number; assignedUserId?: string; accountId?: string; contactId?: string; dealId?: string; sort?: string }
  ) {
    const { skip, take, page, limit } = toPagination(query);
    const orderBy = parseSort(query.sort, ['dueDate', 'createdAt', 'updatedAt', 'priority'], 'dueDate');
    const where: Record<string, unknown> = {};
    if (query.assignedUserId) {
      where.assignedUserId = query.assignedUserId;
    }
    if (query.accountId) {
      where.accountId = query.accountId;
    }
    if (query.contactId) {
      where.contactId = query.contactId;
    }
    if (query.dealId) {
      where.dealId = query.dealId;
    }
    const { items, total } = await this.tasks.listForUser(user, { skip, take, where, orderBy });
    return { data: items, meta: { page, limit, total }, error: null };
  }

  @Get(':id')
  @RequirePermissions({ action: PermissionAction.READ, resource: 'task' })
  async get(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.tasks.getForUser(user, id);
  }

  @Post()
  @RequirePermissions({ action: PermissionAction.CREATE, resource: 'task' })
  async create(@CurrentUser() user: AuthUser, @Body(new ZodValidationPipe(taskCreateSchema)) body: Record<string, unknown>) {
    return this.tasks.createForUser(user, body);
  }

  @Put(':id')
  @RequirePermissions({ action: PermissionAction.UPDATE, resource: 'task' })
  async update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body(new ZodValidationPipe(taskUpdateSchema)) body: Record<string, unknown>) {
    return this.tasks.updateForUser(user, id, body);
  }
}
