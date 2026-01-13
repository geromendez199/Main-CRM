import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service.js';
import { TeamsController } from './teams.controller.js';
import { PrismaService } from '../../common/prisma.service.js';
import { RolesModule } from '../roles/roles.module.js';

@Module({
  imports: [RolesModule],
  controllers: [TeamsController],
  providers: [TeamsService, PrismaService]
})
export class TeamsModule {}
