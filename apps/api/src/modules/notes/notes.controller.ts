import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service.js';
import { JwtAuthGuard } from '../../auth/jwt.guard.js';
import { PermissionsGuard } from '../roles/permissions.guard.js';
import { RequirePermissions } from '../../common/permissions.decorator.js';
import { PermissionAction, noteCreateSchema, noteUpdateSchema } from '@maincrm/shared';
import { ZodValidationPipe } from '../../common/zod-validation.pipe.js';
import { CurrentUser } from '../users/current-user.decorator.js';
import type { AuthUser } from '../../auth/auth.types.js';
import { toPagination } from '../../common/pagination.js';
import { parseSort } from '../../common/sort.js';

@Controller('api/v1/notes')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class NotesController {
  constructor(private readonly notes: NotesService) {}

  @Get()
  @RequirePermissions({ action: PermissionAction.READ, resource: 'note' })
  async list(
    @CurrentUser() user: AuthUser,
    @Query() query: { page?: number; limit?: number; accountId?: string; contactId?: string; dealId?: string; sort?: string }
  ) {
    const { skip, take, page, limit } = toPagination(query);
    const orderBy = parseSort(query.sort, ['createdAt', 'updatedAt'], 'createdAt');
    const where: Record<string, unknown> = {};
    if (query.accountId) {
      where.accountId = query.accountId;
    }
    if (query.contactId) {
      where.contactId = query.contactId;
    }
    if (query.dealId) {
      where.dealId = query.dealId;
    }
    const { items, total } = await this.notes.listForUser(user, { skip, take, where, orderBy });
    return { data: items, meta: { page, limit, total }, error: null };
  }

  @Get(':id')
  @RequirePermissions({ action: PermissionAction.READ, resource: 'note' })
  async get(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.notes.getForUser(user, id);
  }

  @Post()
  @RequirePermissions({ action: PermissionAction.CREATE, resource: 'note' })
  async create(@CurrentUser() user: AuthUser, @Body(new ZodValidationPipe(noteCreateSchema)) body: Record<string, unknown>) {
    return this.notes.createForUser(user, body);
  }

  @Put(':id')
  @RequirePermissions({ action: PermissionAction.UPDATE, resource: 'note' })
  async update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body(new ZodValidationPipe(noteUpdateSchema)) body: Record<string, unknown>) {
    return this.notes.updateForUser(user, id, body);
  }
}
