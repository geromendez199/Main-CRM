import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { JwtAuthGuard } from '../../auth/jwt.guard.js';
import { PermissionsGuard } from '../roles/permissions.guard.js';
import { RequirePermissions } from '../../common/permissions.decorator.js';
import { PermissionAction, userCreateSchema, userUpdateSchema } from '@maincrm/shared';
import { ZodValidationPipe } from '../../common/zod-validation.pipe.js';
import { CurrentUser } from './current-user.decorator.js';
import { toPagination } from '../../common/pagination.js';
import { parseSort } from '../../common/sort.js';
import type { AuthUser } from '../../auth/auth.types.js';

@Controller('api/v1/users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  @RequirePermissions({ action: PermissionAction.READ, resource: 'user' })
  async list(@CurrentUser() user: AuthUser, @Query() query: { page?: number; limit?: number; sort?: string }) {
    const { skip, take, page, limit } = toPagination(query);
    const orderBy = parseSort(query.sort, ['email', 'createdAt', 'updatedAt'], 'createdAt');
    const { items, total } = await this.users.list(user, { skip, take, orderBy });
    return { data: items, meta: { page, limit, total }, error: null };
  }

  @Get(':id')
  @RequirePermissions({ action: PermissionAction.READ, resource: 'user' })
  async get(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.users.get(user, id);
  }

  @Post()
  @RequirePermissions({ action: PermissionAction.CREATE, resource: 'user' })
  async create(@CurrentUser() user: AuthUser, @Body(new ZodValidationPipe(userCreateSchema)) body: Record<string, unknown>) {
    return this.users.create(user, body as { email: string; password: string; name?: string; roleId: string; teamId?: string });
  }

  @Put(':id')
  @RequirePermissions({ action: PermissionAction.UPDATE, resource: 'user' })
  async update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body(new ZodValidationPipe(userUpdateSchema)) body: Record<string, unknown>) {
    return this.users.update(user, id, body as { email?: string; password?: string; name?: string; roleId?: string; teamId?: string });
  }
}
