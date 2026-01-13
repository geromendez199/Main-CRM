import { SetMetadata } from '@nestjs/common';
import type { RoleName } from '@prisma/client';

export const ROLES_KEY = 'roles';

export const RequireRoles = (...roles: RoleName[]) => SetMetadata(ROLES_KEY, roles);
