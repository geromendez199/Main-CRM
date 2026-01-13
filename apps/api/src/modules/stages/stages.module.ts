import { Module } from '@nestjs/common';
import { StagesService } from './stages.service.js';
import { StagesController } from './stages.controller.js';
import { PrismaService } from '../../common/prisma.service.js';
import { RolesModule } from '../roles/roles.module.js';

@Module({
  imports: [RolesModule],
  controllers: [StagesController],
  providers: [StagesService, PrismaService]
})
export class StagesModule {}
