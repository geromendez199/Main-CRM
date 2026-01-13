import { getAccessToken, setAccessToken } from './auth';

export type ApiResponse<T> = {
  data: T;
  meta: Record<string, unknown> | null;
  error: { message: string } | null;
};

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

async function refreshAccessToken(): Promise<string | null> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({})
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as { accessToken?: string };
  if (payload.accessToken) {
    setAccessToken(payload.accessToken);
    return payload.accessToken;
  }
  return null;
}

export async function apiFetch<T>(path: string, init?: RequestInit, { retryOnUnauthorized = true } = {}): Promise<ApiResponse<T>> {
  const token = getAccessToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {})
    },
    credentials: 'include',
    cache: 'no-store'
  });

  if (response.status === 401 && retryOnUnauthorized) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return apiFetch<T>(path, init, { retryOnUnauthorized: false });
    }
  }

  const data = (await response.json()) as ApiResponse<T>;
  if (!response.ok) {
    throw new Error(data.error?.message ?? 'Request failed');
  }
  return data;
}
