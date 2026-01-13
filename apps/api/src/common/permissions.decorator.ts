import { SetMetadata } from '@nestjs/common';
import type { PermissionAction } from '@maincrm/shared';

export const PERMISSIONS_KEY = 'permissions';

export interface PermissionRequirement {
  action: PermissionAction;
  resource: string;
}

export const RequirePermissions = (...permissions: PermissionRequirement[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
