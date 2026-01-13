import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import argon2 from 'argon2';
import { PrismaClient, RoleName, PermissionAction, DealStageKey } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { AppModule } from '../../src/app.module.js';
import { RequestContextMiddleware } from '../../src/common/request-context.middleware.js';
import { ResponseInterceptor } from '../../src/common/response.interceptor.js';
import { HttpExceptionFilter } from '../../src/common/http-exception.filter.js';
import { RequestContextInterceptor } from '../../src/common/request-context.interceptor.js';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

describe('Auth + Account + Deal flow (integration)', () => {
  const prisma = new PrismaClient();
  let app: INestApplication;
  const tenantSlug = `test-${randomUUID()}`;
  const email = `admin-${randomUUID()}@maincrm.test`;
  const password = 'ChangeMe123!';
  let pipelineId = '';
  let leadStageId = '';
  let wonStageId = '';

  beforeAll(async () => {
    process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? 'test_access_secret';
    process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'test_refresh_secret';
    process.env.JWT_ACCESS_EXPIRES_IN = '900s';
    process.env.JWT_REFRESH_EXPIRES_IN = '30d';
    process.env.REDIS_URL = process.env.REDIS_URL ?? 'redis://localhost:6379';

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();
    app.use(helmet());
    app.use(cookieParser());
    app.use(new RequestContextMiddleware().use);
    app.useGlobalInterceptors(new RequestContextInterceptor(), new ResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();

    const tenant = await prisma.tenant.create({
      data: { name: 'Test Tenant', slug: tenantSlug }
    });

    const permissions = [
      { action: PermissionAction.CREATE, resource: 'account' },
      { action: PermissionAction.READ, resource: 'pipeline' },
      { action: PermissionAction.READ, resource: 'stage' },
      { action: PermissionAction.CREATE, resource: 'deal' },
      { action: PermissionAction.UPDATE, resource: 'deal' }
    ];

    const createdPermissions = await prisma.$transaction(
      permissions.map((permission) =>
        prisma.permission.create({
          data: {
            tenantId: tenant.id,
            action: permission.action,
            resource: permission.resource
          }
        })
      )
    );

    const role = await prisma.role.create({
      data: { tenantId: tenant.id, name: RoleName.ADMIN }
    });

    await prisma.rolePermission.createMany({
      data: createdPermissions.map((permission) => ({
        roleId: role.id,
        permissionId: permission.id
      }))
    });

    const passwordHash = await argon2.hash(password);

    await prisma.user.create({
      data: {
        tenantId: tenant.id,
        email,
        password: passwordHash,
        roleId: role.id,
        name: 'Integration Admin'
      }
    });

    const pipeline = await prisma.pipeline.create({
      data: { tenantId: tenant.id, name: 'Integration Pipeline' }
    });
    pipelineId = pipeline.id;

    const stages = await prisma.$transaction([
      prisma.stage.create({
        data: {
          tenantId: tenant.id,
          pipelineId: pipeline.id,
          name: 'Lead',
          key: DealStageKey.LEAD,
          order: 1
        }
      }),
      prisma.stage.create({
        data: {
          tenantId: tenant.id,
          pipelineId: pipeline.id,
          name: 'Won',
          key: DealStageKey.WON,
          order: 2
        }
      })
    ]);
    leadStageId = stages[0].id;
    wonStageId = stages[1].id;

    await prisma.automationRule.create({
      data: {
        tenantId: tenant.id,
        name: 'Integration Deal Won',
        trigger: 'deal.stage.won',
        action: 'create_onboarding_tasks',
        enabled: true
      }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('logs in and manages deals to WON', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email, password })
      .expect(201);

    const accessToken = loginResponse.body.data.accessToken as string;
    expect(accessToken).toBeTruthy();

    const accountResponse = await request(app.getHttpServer())
      .post('/api/v1/accounts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Integration Account' })
      .expect(201);

    const accountId = accountResponse.body.data.id as string;

    const pipelinesResponse = await request(app.getHttpServer())
      .get('/api/v1/pipelines')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(pipelinesResponse.body.data.items).toHaveLength(1);

    const stagesResponse = await request(app.getHttpServer())
      .get('/api/v1/stages')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(stagesResponse.body.data.items.length).toBeGreaterThan(0);

    const dealResponse = await request(app.getHttpServer())
      .post('/api/v1/deals')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Integration Deal',
        accountId,
        pipelineId,
        stageId: leadStageId
      })
      .expect(201);

    const dealId = dealResponse.body.data.id as string;

    await request(app.getHttpServer())
      .put(`/api/v1/deals/${dealId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ stageId: wonStageId })
      .expect(200);
  });
});
