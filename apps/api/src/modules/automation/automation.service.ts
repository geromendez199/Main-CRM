import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { PrismaService } from '../../common/prisma.service.js';

@Injectable()
export class AutomationService {
  private automationsQueue: Queue;

  constructor(private readonly prisma: PrismaService) {
    this.automationsQueue = new Queue('automations', {
      connection: { url: process.env.REDIS_URL }
    });
  }

  async enqueueDealWon(tenantId: string, dealId: string): Promise<void> {
    const rule = await this.prisma.automationRule.findFirst({
      where: { tenantId, trigger: 'deal.stage.won', enabled: true, deletedAt: null }
    });
    if (!rule) {
      return;
    }
    await this.automationsQueue.add(
      'deal-stage-won',
      { tenantId, dealId, ruleId: rule.id },
      { attempts: 3, backoff: { type: 'exponential', delay: 5000 } }
    );
  }
}
