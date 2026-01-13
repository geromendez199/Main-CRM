import type { ApiResponse } from './types.js';

export async function apiFetch<T>(input: RequestInfo | URL, init?: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    }
  });

  const data = (await response.json()) as ApiResponse<T>;
  if (!response.ok) {
    throw new Error(data.error?.message ?? 'Request failed');
  }
  return data;
}
