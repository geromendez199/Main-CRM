import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service.js';
import { SecureService } from '../../common/secure.service.js';
import { AccessControlService } from '../roles/access-control.service.js';

@Injectable()
export class ContactsService extends SecureService {
  constructor(prisma: PrismaService, access: AccessControlService) {
    super(prisma, 'contact', access, 'contact');
  }
}
