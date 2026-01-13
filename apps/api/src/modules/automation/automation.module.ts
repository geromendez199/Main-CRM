import { Module } from '@nestjs/common';
import { AutomationRulesService } from './automation-rules.service.js';
import { AutomationRulesController } from './automation-rules.controller.js';
import { PrismaService } from '../../common/prisma.service.js';
import { RolesModule } from '../roles/roles.module.js';
import { AutomationService } from './automation.service.js';

@Module({
  imports: [RolesModule],
  controllers: [AutomationRulesController],
  providers: [AutomationRulesService, AutomationService, PrismaService],
  exports: [AutomationService]
})
export class AutomationModule {}
