import { Module } from '@nestjs/common';
import { PipelinesService } from './pipelines.service.js';
import { PipelinesController } from './pipelines.controller.js';
import { PrismaService } from '../../common/prisma.service.js';
import { RolesModule } from '../roles/roles.module.js';

@Module({
  imports: [RolesModule],
  controllers: [PipelinesController],
  providers: [PipelinesService, PrismaService]
})
export class PipelinesModule {}
