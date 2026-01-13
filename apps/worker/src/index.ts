import { Worker, QueueEvents } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import pino from 'pino';
import { processDealStageWonJob } from './automations.js';

const logger = pino({ level: process.env.LOG_LEVEL ?? 'info' });
const prisma = new PrismaClient();

const connection = { url: process.env.REDIS_URL };

const automationsWorker = new Worker(
  'automations',
  async (job) => {
    if (job.name === 'deal-stage-won') {
      const { tenantId, dealId } = job.data as { tenantId: string; dealId: string };
      await processDealStageWonJob({ prisma, logger }, { tenantId, dealId });
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
