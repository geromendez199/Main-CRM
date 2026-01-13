import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module.js';
import { AccountsModule } from './modules/accounts/accounts.module.js';
import { ContactsModule } from './modules/contacts/contacts.module.js';
import { DealsModule } from './modules/deals/deals.module.js';
import { PipelinesModule } from './modules/pipelines/pipelines.module.js';
import { StagesModule } from './modules/stages/stages.module.js';
import { ActivitiesModule } from './modules/activities/activities.module.js';
import { TasksModule } from './modules/tasks/tasks.module.js';
import { NotesModule } from './modules/notes/notes.module.js';
import { TagsModule } from './modules/tags/tags.module.js';
import { AttachmentsModule } from './modules/attachments/attachments.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { RolesModule } from './modules/roles/roles.module.js';
import { PermissionsModule } from './modules/permissions/permissions.module.js';
import { TeamsModule } from './modules/teams/teams.module.js';
import { AuditModule } from './modules/audit/audit.module.js';
import { AutomationModule } from './modules/automation/automation.module.js';
import { TenantModule } from './modules/tenant/tenant.module.js';
import { HealthModule } from './modules/health/health.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({ ttl: 60, limit: 20 }),
    AuthModule,
    AccountsModule,
    ContactsModule,
    DealsModule,
    PipelinesModule,
    StagesModule,
    ActivitiesModule,
    TasksModule,
    NotesModule,
    TagsModule,
    AttachmentsModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    TeamsModule,
    AuditModule,
    AutomationModule,
    TenantModule,
    HealthModule
  ]
})
export class AppModule {}
