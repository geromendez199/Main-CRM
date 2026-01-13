import { processDealStageWonJob } from './automations.js';

const createLogger = () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
});

describe('processDealStageWonJob', () => {
  it('creates onboarding tasks and audit logs', async () => {
    const prisma = {
      deal: {
        findFirst: jest.fn().mockResolvedValue({ id: 'deal-1' })
      },
      task: {
        create: jest.fn()
      },
      auditLog: {
        create: jest.fn().mockResolvedValue({})
      }
    } as any;

    prisma.task.create
      .mockResolvedValueOnce({ id: 'task-1' })
      .mockResolvedValueOnce({ id: 'task-2' });

    const logger = createLogger();

    await processDealStageWonJob(
      { prisma, logger },
      { tenantId: 'tenant-1', dealId: 'deal-1' }
    );

    expect(prisma.task.create).toHaveBeenCalledTimes(2);
    expect(prisma.auditLog.create).toHaveBeenCalledTimes(2);
    expect(logger.info).toHaveBeenCalledWith({ dealId: 'deal-1' }, 'Onboarding tasks created');
  });

  it('skips when deal is missing', async () => {
    const prisma = {
      deal: {
        findFirst: jest.fn().mockResolvedValue(null)
      },
      task: {
        create: jest.fn()
      },
      auditLog: {
        create: jest.fn()
      }
    } as any;

    const logger = createLogger();

    await processDealStageWonJob(
      { prisma, logger },
      { tenantId: 'tenant-1', dealId: 'missing' }
    );

    expect(prisma.task.create).not.toHaveBeenCalled();
    expect(prisma.auditLog.create).not.toHaveBeenCalled();
    expect(logger.warn).toHaveBeenCalledWith({ dealId: 'missing' }, 'Deal not found for automation');
  });
});
