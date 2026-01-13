import { Injectable } from '@nestjs/common';
import argon2 from 'argon2';
import { PrismaService } from '../../common/prisma.service.js';
import { AccessControlService } from '../roles/access-control.service.js';
import type { AuthUser } from '../../auth/auth.types.js';
import { PermissionAction } from '@maincrm/shared';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService, private readonly access: AccessControlService) {}

  async list(user: AuthUser, args: { skip?: number; take?: number; orderBy?: Record<string, 'asc' | 'desc'> }) {
    await this.access.assertPermissions(user, [{ action: PermissionAction.READ, resource: 'user' }]);
    const where = { tenantId: user.tenantId, deletedAt: null };
    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        include: { role: true },
        skip: args.skip,
        take: args.take,
        orderBy: args.orderBy
      }),
      this.prisma.user.count({ where })
    ]);
    return { items, total };
  }

  async get(user: AuthUser, id: string) {
    await this.access.assertPermissions(user, [{ action: PermissionAction.READ, resource: 'user' }]);
    return this.prisma.user.findFirst({ where: { tenantId: user.tenantId, id, deletedAt: null }, include: { role: true } });
  }

  async create(user: AuthUser, data: { email: string; password: string; name?: string; roleId: string; teamId?: string }) {
    await this.access.assertPermissions(user, [{ action: PermissionAction.CREATE, resource: 'user' }]);
    const password = await argon2.hash(data.password);
    return this.prisma.user.create({
      data: {
        tenantId: user.tenantId,
        email: data.email,
        password,
        name: data.name,
        roleId: data.roleId,
        teamId: data.teamId
      }
    });
  }

  async update(user: AuthUser, id: string, data: { email?: string; password?: string; name?: string; roleId?: string; teamId?: string }) {
    await this.access.assertPermissions(user, [{ action: PermissionAction.UPDATE, resource: 'user' }]);
    const updateData: Record<string, unknown> = { ...data };
    if (data.password) {
      updateData.password = await argon2.hash(data.password);
    }
    return this.prisma.user.update({ where: { id }, data: updateData });
  }
}
