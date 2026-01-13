import { PrismaClient, RoleName } from '@prisma/client';
import argon2 from 'argon2';
import { DealStageKey, PermissionAction } from '@maincrm/shared';

const prisma = new PrismaClient();

const resources = [
  'tenant',
  'user',
  'team',
  'role',
  'permission',
  'account',
  'contact',
  'pipeline',
  'stage',
  'deal',
  'activity',
  'task',
  'note',
  'attachment',
  'tag',
  'audit_log',
  'automation_rule'
];

async function main() {
  const tenantName = process.env.SEED_TENANT_NAME ?? 'Default Tenant';
  const tenantSlug = process.env.SEED_TENANT_SLUG ?? 'default';
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@maincrm.local';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe123!';

  const tenant = await prisma.tenant.upsert({
    where: { slug: tenantSlug },
    update: { name: tenantName },
    create: { name: tenantName, slug: tenantSlug }
  });

  const permissions = await prisma.$transaction(
    resources.flatMap((resource) =>
      Object.values(PermissionAction).map((action) =>
        prisma.permission.upsert({
          where: { tenantId_action_resource: { tenantId: tenant.id, action, resource } },
          update: {},
          create: { tenantId: tenant.id, action, resource }
        })
      )
    )
  );

  const roleNames = [RoleName.ADMIN, RoleName.MANAGER, RoleName.USER, RoleName.READ_ONLY];
  const roles = await Promise.all(
    roleNames.map((name) =>
      prisma.role.upsert({
        where: { tenantId_name: { tenantId: tenant.id, name } },
        update: {},
        create: { tenantId: tenant.id, name }
      })
    )
  );

  const roleMap = new Map(roles.map((role) => [role.name, role]));

  const adminRole = roleMap.get(RoleName.ADMIN)!;
  const managerRole = roleMap.get(RoleName.MANAGER)!;
  const userRole = roleMap.get(RoleName.USER)!;
  const readOnlyRole = roleMap.get(RoleName.READ_ONLY)!;

  const adminPermissions = permissions.map((permission) => permission.id);
  const managerPermissions = permissions
    .filter((permission) => permission.action !== PermissionAction.DELETE)
    .map((permission) => permission.id);
  const userPermissions = permissions
    .filter((permission) => [PermissionAction.READ, PermissionAction.CREATE, PermissionAction.UPDATE].includes(permission.action))
    .map((permission) => permission.id);
  const readPermissions = permissions
    .filter((permission) => permission.action === PermissionAction.READ)
    .map((permission) => permission.id);

  await prisma.rolePermission.deleteMany({
    where: { roleId: { in: roles.map((role) => role.id) } }
  });

  await prisma.rolePermission.createMany({
    data: adminPermissions.map((permissionId) => ({ roleId: adminRole.id, permissionId }))
  });

  await prisma.rolePermission.createMany({
    data: managerPermissions.map((permissionId) => ({ roleId: managerRole.id, permissionId }))
  });

  await prisma.rolePermission.createMany({
    data: userPermissions.map((permissionId) => ({ roleId: userRole.id, permissionId }))
  });

  await prisma.rolePermission.createMany({
    data: readPermissions.map((permissionId) => ({ roleId: readOnlyRole.id, permissionId }))
  });

  const passwordHash = await argon2.hash(adminPassword);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      tenantId: tenant.id,
      password: passwordHash,
      roleId: adminRole.id
    },
    create: {
      tenantId: tenant.id,
      email: adminEmail,
      password: passwordHash,
      roleId: adminRole.id,
      name: 'Admin'
    }
  });

  const existingPipeline = await prisma.pipeline.findFirst({ where: { tenantId: tenant.id } });
  const pipeline = existingPipeline
    ? await prisma.pipeline.update({ where: { id: existingPipeline.id }, data: { name: 'Default Pipeline' } })
    : await prisma.pipeline.create({ data: { tenantId: tenant.id, name: 'Default Pipeline' } });

  const stages = [
    { key: DealStageKey.LEAD, name: 'Lead', order: 1 },
    { key: DealStageKey.QUALIFIED, name: 'Qualified', order: 2 },
    { key: DealStageKey.PROPOSAL, name: 'Proposal', order: 3 },
    { key: DealStageKey.NEGOTIATION, name: 'Negotiation', order: 4 },
    { key: DealStageKey.WON, name: 'Won', order: 5 },
    { key: DealStageKey.LOST, name: 'Lost', order: 6 }
  ];

  await prisma.stage.deleteMany({ where: { pipelineId: pipeline.id } });
  await prisma.stage.createMany({
    data: stages.map((stage) => ({
      tenantId: tenant.id,
      pipelineId: pipeline.id,
      name: stage.name,
      key: stage.key,
      order: stage.order
    }))
  });

  const existingRule = await prisma.automationRule.findFirst({ where: { tenantId: tenant.id } });
  if (existingRule) {
    await prisma.automationRule.update({
      where: { id: existingRule.id },
      data: { name: 'Deal won onboarding', trigger: 'deal.stage.won', action: 'create_onboarding_tasks' }
    });
  } else {
    await prisma.automationRule.create({
      data: {
        tenantId: tenant.id,
        name: 'Deal won onboarding',
        trigger: 'deal.stage.won',
        action: 'create_onboarding_tasks',
        enabled: true
      }
    });
  }

  console.log('Seeded tenant', tenant.id);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
