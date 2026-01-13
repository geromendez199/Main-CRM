import { z } from 'zod';
import { ActivityType, DealStageKey, TaskPriority, TaskStatus } from './enums.js';
import { PASSWORD_POLICY_MESSAGE, PASSWORD_POLICY_REGEX } from './constants.js';

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20)
});

export const accountCreateSchema = z.object({
  name: z.string().min(2),
  ownerId: z.string().uuid().optional(),
  website: z.string().url().optional(),
  industry: z.string().optional()
});

export const accountUpdateSchema = accountCreateSchema.partial();

export const contactCreateSchema = z.object({
  accountId: z.string().uuid(),
  name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  title: z.string().optional()
});

export const contactUpdateSchema = contactCreateSchema.partial();

export const dealCreateSchema = z.object({
  accountId: z.string().uuid(),
  name: z.string().min(2),
  ownerId: z.string().uuid().optional(),
  pipelineId: z.string().uuid(),
  stageId: z.string().uuid(),
  value: z.number().nonnegative().optional()
});

export const dealUpdateSchema = dealCreateSchema.partial();

export const activityCreateSchema = z.object({
  type: z.nativeEnum(ActivityType),
  subject: z.string().min(2),
  description: z.string().optional(),
  accountId: z.string().uuid().optional(),
  contactId: z.string().uuid().optional(),
  dealId: z.string().uuid().optional()
});

export const activityUpdateSchema = activityCreateSchema.partial();

export const taskCreateSchema = z.object({
  title: z.string().min(2),
  dueDate: z.string().datetime().optional(),
  priority: z.nativeEnum(TaskPriority).default(TaskPriority.MEDIUM),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.OPEN),
  assignedUserId: z.string().uuid().optional(),
  accountId: z.string().uuid().optional(),
  contactId: z.string().uuid().optional(),
  dealId: z.string().uuid().optional()
});

export const taskUpdateSchema = taskCreateSchema.partial();

export const noteCreateSchema = z.object({
  body: z.string().min(1),
  accountId: z.string().uuid().optional(),
  contactId: z.string().uuid().optional(),
  dealId: z.string().uuid().optional()
});

export const noteUpdateSchema = noteCreateSchema.partial();

export const tagCreateSchema = z.object({
  name: z.string().min(1)
});

export const tagUpdateSchema = tagCreateSchema.partial();

export const attachmentCreateSchema = z.object({
  filename: z.string().min(1),
  url: z.string().url(),
  mimeType: z.string().min(1),
  size: z.number().int().nonnegative(),
  accountId: z.string().uuid().optional(),
  contactId: z.string().uuid().optional(),
  dealId: z.string().uuid().optional()
});

export const attachmentUpdateSchema = attachmentCreateSchema.partial();

export const teamCreateSchema = z.object({
  name: z.string().min(2)
});

export const teamUpdateSchema = teamCreateSchema.partial();

export const userCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().regex(PASSWORD_POLICY_REGEX, PASSWORD_POLICY_MESSAGE),
  name: z.string().min(1).optional(),
  roleId: z.string().uuid(),
  teamId: z.string().uuid().optional()
});

export const userUpdateSchema = userCreateSchema.partial();

export const automationRuleCreateSchema = z.object({
  name: z.string().min(2),
  trigger: z.string().min(2),
  action: z.string().min(2),
  enabled: z.boolean().default(true)
});

export const automationRuleUpdateSchema = automationRuleCreateSchema.partial();

export const pipelineCreateSchema = z.object({
  name: z.string().min(2)
});

export const pipelineUpdateSchema = pipelineCreateSchema.partial();

export const stageCreateSchema = z.object({
  pipelineId: z.string().uuid(),
  name: z.string().min(2),
  key: z.nativeEnum(DealStageKey),
  order: z.number().int().min(1)
});

export const stageUpdateSchema = stageCreateSchema.partial();

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(12)
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(10).optional()
});
