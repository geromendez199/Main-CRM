import { Test } from '@nestjs/testing';
import { HealthController } from './modules/health/health.controller.js';
import { PrismaService } from './common/prisma.service.js';

describe('HealthController', () => {
  it('returns ok', async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: PrismaService,
          useValue: { $queryRaw: jest.fn() }
        }
      ]
    }).compile();
    const controller = moduleRef.get(HealthController);
    expect(controller.check()).toEqual({ status: 'ok' });
  });
});
