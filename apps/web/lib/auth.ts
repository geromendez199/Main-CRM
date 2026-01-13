export type SessionUser = {
  id: string;
  tenantId: string;
  email: string;
  role: string;
  teamId?: string | null;
};

export type Session = {
  accessToken: string;
  user: SessionUser;
};

const ACCESS_TOKEN_KEY = 'maincrm_access_token';
const USER_KEY = 'maincrm_user';

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string) {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function setUser(user: SessionUser) {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser(): SessionUser | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) {
      return null;
    }
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = typeof window !== 'undefined' && window.atob ? window.atob(normalized) : Buffer.from(normalized, 'base64').toString('utf-8');
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function getUserFromToken(token: string): SessionUser | null {
  const payload = decodeJwt(token);
  if (!payload) {
    return null;
  }
  const user = {
    id: String(payload.sub ?? ''),
    tenantId: String(payload.tenantId ?? ''),
    email: String(payload.email ?? ''),
    role: String(payload.role ?? ''),
    teamId: payload.teamId ? String(payload.teamId) : null
  };
  if (!user.id || !user.email || !user.tenantId) {
    return null;
  }
  return user;
}
