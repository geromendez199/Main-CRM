import { Module } from '@nestjs/common';
import { NotesService } from './notes.service.js';
import { NotesController } from './notes.controller.js';
import { PrismaService } from '../../common/prisma.service.js';
import { RolesModule } from '../roles/roles.module.js';

@Module({
  imports: [RolesModule],
  controllers: [NotesController],
  providers: [NotesService, PrismaService]
})
export class NotesModule {}
