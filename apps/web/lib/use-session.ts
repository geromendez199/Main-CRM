'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { login as loginRequest, logout as logoutRequest } from './api';
import { API_BASE_URL } from './api-client';
import { clearSession, getStoredUser, getUserFromToken, setAccessToken, setUser, type SessionUser } from './auth';

export function useSession() {
  return useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const storedUser = getStoredUser();
      const token = typeof window !== 'undefined' ? window.localStorage.getItem('maincrm_access_token') : null;
      if (storedUser && token) {
        return { user: storedUser, accessToken: token };
      }
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({}),
        cache: 'no-store'
      });
      if (!response.ok) {
        return null;
      }
      const payload = (await response.json()) as { accessToken?: string };
      if (!payload.accessToken) {
        return null;
      }
      setAccessToken(payload.accessToken);
      const user = getUserFromToken(payload.accessToken);
      if (user) {
        setUser(user);
        return { user, accessToken: payload.accessToken };
      }
      return null;
    },
    staleTime: 5 * 60 * 1000
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return async (email: string, password: string) => {
    const response = await loginRequest(email, password);
    setAccessToken(response.data.accessToken);
    const userFromToken = getUserFromToken(response.data.accessToken);
    const user: SessionUser = userFromToken ?? {
      ...response.data.user,
      role: response.data.user.role
    };
    setUser(user);
    queryClient.setQueryData(['session'], { user, accessToken: response.data.accessToken });
    return user;
  };
}

export function useLogout() {
  const queryClient = useQueryClient();
  return async () => {
    await logoutRequest();
    clearSession();
    queryClient.setQueryData(['session'], null);
  };
}
