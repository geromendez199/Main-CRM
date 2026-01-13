import { Worker, QueueEvents } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import pino from 'pino';

const logger = pino({ level: process.env.LOG_LEVEL ?? 'info' });
const prisma = new PrismaClient();

const connection = { url: process.env.REDIS_URL };

const automationsWorker = new Worker(
  'automations',
  async (job) => {
    if (job.name === 'deal-stage-won') {
      const { tenantId, dealId } = job.data as { tenantId: string; dealId: string };
      const deal = await prisma.deal.findFirst({ where: { id: dealId, tenantId } });
      if (!deal) {
        logger.warn({ dealId }, 'Deal not found for automation');
        return;
      }
      const tasks = [
        {
          tenantId,
          title: 'Schedule onboarding kickoff call',
          priority: 'HIGH',
          status: 'OPEN',
          dealId: dealId
        },
        {
          tenantId,
          title: 'Send welcome email',
          priority: 'MEDIUM',
          status: 'OPEN',
          dealId: dealId
        }
      ];

      for (const task of tasks) {
        const created = await prisma.task.create({ data: task });
        await prisma.auditLog.create({
          data: {
            tenantId,
            actorUserId: null,
            entityType: 'Task',
            entityId: created.id,
            action: 'CREATE',
            beforeJson: null,
            afterJson: created,
            requestId: 'automation',
            ipAddress: null,
            userAgent: 'worker'
          }
        });
      }
      logger.info({ dealId }, 'Onboarding tasks created');
      logger.info({ dealId }, 'Webhook emitted: deal.won');
    }
  },
  { connection }
);

new Worker('notifications', async () => {}, { connection });
new Worker('webhooks', async () => {}, { connection });

const automationsEvents = new QueueEvents('automations', { connection });

automationsEvents.on('failed', (event) => {
  logger.error({ event }, 'Automation job failed');
});

automationsWorker.on('error', (error) => {
  logger.error({ error }, 'Automation worker error');
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  await automationsWorker.close();
  await automationsEvents.close();
  process.exit(0);
});
