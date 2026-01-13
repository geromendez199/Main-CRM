import type { RoleName } from '@prisma/client';

export interface AuthUser {
  id: string;
  tenantId: string;
  email: string;
  role: RoleName;
  teamId: string | null;
}

export interface JwtPayload {
  sub: string;
  tenantId: string;
  email: string;
  role: RoleName;
  teamId: string | null;
}
