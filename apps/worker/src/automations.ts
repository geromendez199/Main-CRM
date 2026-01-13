import type { PrismaClient, TaskPriority, TaskStatus } from '@prisma/client';
import type { Logger } from 'pino';

export interface DealWonJobData {
  tenantId: string;
  dealId: string;
}

interface DealWonDependencies {
  prisma: PrismaClient;
  logger: Logger;
}

export async function processDealStageWonJob(
  { prisma, logger }: DealWonDependencies,
  data: DealWonJobData
): Promise<void> {
  const deal = await prisma.deal.findFirst({ where: { id: data.dealId, tenantId: data.tenantId, deletedAt: null } });
  if (!deal) {
    logger.warn({ dealId: data.dealId }, 'Deal not found for automation');
    return;
  }

  const tasks: Array<{ tenantId: string; title: string; priority: TaskPriority; status: TaskStatus; dealId: string }> = [
    {
      tenantId: data.tenantId,
      title: 'Schedule onboarding kickoff call',
      priority: 'HIGH',
      status: 'OPEN',
      dealId: data.dealId
    },
    {
      tenantId: data.tenantId,
      title: 'Send welcome email',
      priority: 'MEDIUM',
      status: 'OPEN',
      dealId: data.dealId
    }
  ];

  for (const task of tasks) {
    const created = await prisma.task.create({ data: task });
    await prisma.auditLog.create({
      data: {
        tenantId: data.tenantId,
        actorUserId: null,
        entityType: 'Task',
        entityId: created.id,
        action: 'CREATE',
        beforeJson: null,
        afterJson: created,
        requestId: `automation:${data.dealId}`,
        ipAddress: null,
        userAgent: 'worker'
      }
    });
  }

  logger.info({ dealId: data.dealId }, 'Onboarding tasks created');
  logger.info({ dealId: data.dealId }, 'Webhook emitted: deal.won');
}
