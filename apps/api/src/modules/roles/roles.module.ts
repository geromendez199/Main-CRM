import { Module } from '@nestjs/common';
import { AccessControlService } from './access-control.service.js';
import { PermissionsGuard } from './permissions.guard.js';
import { RolesGuard } from './roles.guard.js';
import { PrismaService } from '../../common/prisma.service.js';
import { RolesService } from './roles.service.js';
import { RolesController } from './roles.controller.js';

@Module({
  controllers: [RolesController],
  providers: [AccessControlService, PermissionsGuard, RolesGuard, PrismaService, RolesService],
  exports: [AccessControlService, PermissionsGuard, RolesGuard, RolesService]
})
export class RolesModule {}
