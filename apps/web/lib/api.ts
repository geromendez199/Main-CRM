import { apiFetch } from '@maincrm/shared';

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export function getAccounts() {
  return apiFetch(`${baseUrl}/api/v1/accounts`);
}
