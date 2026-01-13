import { Module } from '@nestjs/common';
import { DealsService } from './deals.service.js';
import { DealsController } from './deals.controller.js';
import { PrismaService } from '../../common/prisma.service.js';
import { RolesModule } from '../roles/roles.module.js';
import { AutomationService } from '../automation/automation.service.js';

@Module({
  imports: [RolesModule],
  controllers: [DealsController],
  providers: [DealsService, PrismaService, AutomationService]
})
export class DealsModule {}
