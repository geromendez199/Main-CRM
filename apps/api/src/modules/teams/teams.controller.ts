import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { TeamsService } from './teams.service.js';
import { JwtAuthGuard } from '../../auth/jwt.guard.js';
import { PermissionsGuard } from '../roles/permissions.guard.js';
import { RequirePermissions } from '../../common/permissions.decorator.js';
import { PermissionAction, teamCreateSchema, teamUpdateSchema } from '@maincrm/shared';
import { ZodValidationPipe } from '../../common/zod-validation.pipe.js';
import { CurrentUser } from '../users/current-user.decorator.js';
import type { AuthUser } from '../../auth/auth.types.js';
import { toPagination } from '../../common/pagination.js';
import { parseSort } from '../../common/sort.js';

@Controller('api/v1/teams')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TeamsController {
  constructor(private readonly teams: TeamsService) {}

  @Get()
  @RequirePermissions({ action: PermissionAction.READ, resource: 'team' })
  async list(@CurrentUser() user: AuthUser, @Query() query: { page?: number; limit?: number; sort?: string }) {
    const { skip, take, page, limit } = toPagination(query);
    const orderBy = parseSort(query.sort, ['name', 'createdAt'], 'name');
    const { items, total } = await this.teams.listForUser(user, { skip, take, orderBy });
    return { data: items, meta: { page, limit, total }, error: null };
  }

  @Get(':id')
  @RequirePermissions({ action: PermissionAction.READ, resource: 'team' })
  async get(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.teams.getForUser(user, id);
  }

  @Post()
  @RequirePermissions({ action: PermissionAction.CREATE, resource: 'team' })
  async create(@CurrentUser() user: AuthUser, @Body(new ZodValidationPipe(teamCreateSchema)) body: Record<string, unknown>) {
    return this.teams.createForUser(user, body);
  }

  @Put(':id')
  @RequirePermissions({ action: PermissionAction.UPDATE, resource: 'team' })
  async update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body(new ZodValidationPipe(teamUpdateSchema)) body: Record<string, unknown>) {
    return this.teams.updateForUser(user, id, body);
  }
}
