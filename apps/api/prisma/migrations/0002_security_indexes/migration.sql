ALTER TABLE "users" ADD COLUMN "failed_login_attempts" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "users" ADD COLUMN "locked_until" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN "last_failed_login_at" TIMESTAMP(3);

CREATE INDEX "users_tenant_id_deleted_at_idx" ON "users"("tenant_id", "deleted_at");

CREATE INDEX "teams_tenant_id_deleted_at_idx" ON "teams"("tenant_id", "deleted_at");

CREATE INDEX "roles_tenant_id_deleted_at_idx" ON "roles"("tenant_id", "deleted_at");

CREATE INDEX "permissions_tenant_id_deleted_at_idx" ON "permissions"("tenant_id", "deleted_at");

CREATE INDEX "accounts_tenant_id_deleted_at_idx" ON "accounts"("tenant_id", "deleted_at");
CREATE INDEX "accounts_tenant_id_owner_id_idx" ON "accounts"("tenant_id", "owner_id");

CREATE INDEX "contacts_tenant_id_deleted_at_idx" ON "contacts"("tenant_id", "deleted_at");
CREATE INDEX "contacts_tenant_id_account_id_idx" ON "contacts"("tenant_id", "account_id");

CREATE INDEX "pipelines_tenant_id_deleted_at_idx" ON "pipelines"("tenant_id", "deleted_at");
CREATE UNIQUE INDEX "pipelines_tenant_id_name_key" ON "pipelines"("tenant_id", "name");

CREATE INDEX "stages_tenant_id_deleted_at_idx" ON "stages"("tenant_id", "deleted_at");
CREATE INDEX "stages_tenant_id_pipeline_id_idx" ON "stages"("tenant_id", "pipeline_id");
CREATE INDEX "stages_tenant_id_key_idx" ON "stages"("tenant_id", "key");

CREATE INDEX "deals_tenant_id_deleted_at_idx" ON "deals"("tenant_id", "deleted_at");
CREATE INDEX "deals_tenant_id_account_id_idx" ON "deals"("tenant_id", "account_id");
CREATE INDEX "deals_tenant_id_owner_id_idx" ON "deals"("tenant_id", "owner_id");
CREATE INDEX "deals_tenant_id_pipeline_id_idx" ON "deals"("tenant_id", "pipeline_id");
CREATE INDEX "deals_tenant_id_stage_id_idx" ON "deals"("tenant_id", "stage_id");

CREATE INDEX "activities_tenant_id_deleted_at_idx" ON "activities"("tenant_id", "deleted_at");
CREATE INDEX "activities_tenant_id_account_id_idx" ON "activities"("tenant_id", "account_id");
CREATE INDEX "activities_tenant_id_contact_id_idx" ON "activities"("tenant_id", "contact_id");
CREATE INDEX "activities_tenant_id_deal_id_idx" ON "activities"("tenant_id", "deal_id");

CREATE INDEX "tasks_tenant_id_deleted_at_idx" ON "tasks"("tenant_id", "deleted_at");
CREATE INDEX "tasks_tenant_id_account_id_idx" ON "tasks"("tenant_id", "account_id");
CREATE INDEX "tasks_tenant_id_contact_id_idx" ON "tasks"("tenant_id", "contact_id");
CREATE INDEX "tasks_tenant_id_deal_id_idx" ON "tasks"("tenant_id", "deal_id");
CREATE INDEX "tasks_tenant_id_assigned_user_id_idx" ON "tasks"("tenant_id", "assigned_user_id");

CREATE INDEX "notes_tenant_id_deleted_at_idx" ON "notes"("tenant_id", "deleted_at");
CREATE INDEX "notes_tenant_id_account_id_idx" ON "notes"("tenant_id", "account_id");
CREATE INDEX "notes_tenant_id_contact_id_idx" ON "notes"("tenant_id", "contact_id");
CREATE INDEX "notes_tenant_id_deal_id_idx" ON "notes"("tenant_id", "deal_id");

CREATE INDEX "attachments_tenant_id_deleted_at_idx" ON "attachments"("tenant_id", "deleted_at");
CREATE INDEX "attachments_tenant_id_account_id_idx" ON "attachments"("tenant_id", "account_id");
CREATE INDEX "attachments_tenant_id_contact_id_idx" ON "attachments"("tenant_id", "contact_id");
CREATE INDEX "attachments_tenant_id_deal_id_idx" ON "attachments"("tenant_id", "deal_id");

CREATE INDEX "tags_tenant_id_deleted_at_idx" ON "tags"("tenant_id", "deleted_at");

CREATE INDEX "entity_tags_tenant_id_tag_id_idx" ON "entity_tags"("tenant_id", "tag_id");
CREATE INDEX "entity_tags_tenant_id_account_id_idx" ON "entity_tags"("tenant_id", "account_id");
CREATE INDEX "entity_tags_tenant_id_contact_id_idx" ON "entity_tags"("tenant_id", "contact_id");
CREATE INDEX "entity_tags_tenant_id_deal_id_idx" ON "entity_tags"("tenant_id", "deal_id");

CREATE INDEX "audit_logs_tenant_id_created_at_idx" ON "audit_logs"("tenant_id", "created_at");
CREATE INDEX "audit_logs_tenant_id_entity_type_entity_id_idx" ON "audit_logs"("tenant_id", "entity_type", "entity_id");

CREATE INDEX "automation_rules_tenant_id_deleted_at_idx" ON "automation_rules"("tenant_id", "deleted_at");
CREATE INDEX "automation_rules_tenant_id_trigger_idx" ON "automation_rules"("tenant_id", "trigger");

CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");
CREATE INDEX "refresh_tokens_family_id_idx" ON "refresh_tokens"("family_id");
CREATE INDEX "refresh_tokens_expires_at_idx" ON "refresh_tokens"("expires_at");
