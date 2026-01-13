import type { RoleName } from './enums.js';

export interface ApiResponse<T> {
  data: T;
  meta: Record<string, unknown> | null;
  error: { message: string; code?: string; details?: unknown } | null;
}

export interface AuthUser {
  id: string;
  tenantId: string;
  email: string;
  name: string | null;
  role: RoleName;
  teamId: string | null;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}
