import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AutomationRulesService } from './automation-rules.service.js';
import { JwtAuthGuard } from '../../auth/jwt.guard.js';
import { PermissionsGuard } from '../roles/permissions.guard.js';
import { RequirePermissions } from '../../common/permissions.decorator.js';
import { PermissionAction, automationRuleCreateSchema, automationRuleUpdateSchema } from '@maincrm/shared';
import { ZodValidationPipe } from '../../common/zod-validation.pipe.js';
import { CurrentUser } from '../users/current-user.decorator.js';
import type { AuthUser } from '../../auth/auth.types.js';
import { toPagination } from '../../common/pagination.js';
import { parseSort } from '../../common/sort.js';

@Controller('api/v1/automation-rules')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AutomationRulesController {
  constructor(private readonly automationRules: AutomationRulesService) {}

  @Get()
  @RequirePermissions({ action: PermissionAction.READ, resource: 'automation_rule' })
  async list(@CurrentUser() user: AuthUser, @Query() query: { page?: number; limit?: number; sort?: string }) {
    const { skip, take, page, limit } = toPagination(query);
    const orderBy = parseSort(query.sort, ['createdAt', 'name'], 'createdAt');
    const { items, total } = await this.automationRules.listForUser(user, { skip, take, orderBy });
    return { data: items, meta: { page, limit, total }, error: null };
  }

  @Get(':id')
  @RequirePermissions({ action: PermissionAction.READ, resource: 'automation_rule' })
  async get(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.automationRules.getForUser(user, id);
  }

  @Post()
  @RequirePermissions({ action: PermissionAction.CREATE, resource: 'automation_rule' })
  async create(@CurrentUser() user: AuthUser, @Body(new ZodValidationPipe(automationRuleCreateSchema)) body: Record<string, unknown>) {
    return this.automationRules.createForUser(user, body);
  }

  @Put(':id')
  @RequirePermissions({ action: PermissionAction.UPDATE, resource: 'automation_rule' })
  async update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(automationRuleUpdateSchema)) body: Record<string, unknown>
  ) {
    return this.automationRules.updateForUser(user, id, body);
  }
}
