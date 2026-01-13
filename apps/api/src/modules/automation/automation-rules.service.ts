import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service.js';
import { SecureService } from '../../common/secure.service.js';
import { AccessControlService } from '../roles/access-control.service.js';

@Injectable()
export class AutomationRulesService extends SecureService {
  constructor(prisma: PrismaService, access: AccessControlService) {
    super(prisma, 'automationRule', access, 'automation_rule');
  }
}
