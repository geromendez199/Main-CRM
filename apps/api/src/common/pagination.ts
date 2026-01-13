import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@maincrm/shared';

export function toPagination(query: { page?: number; limit?: number }) {
  const page = Number(query.page ?? 1);
  const limit = Math.min(Number(query.limit ?? DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE);
  return { page, limit, skip: (page - 1) * limit };
}
