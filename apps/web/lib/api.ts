import { apiFetch } from './api-client';

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
};

export type Account = {
  id: string;
  name: string;
  industry?: string | null;
  website?: string | null;
  ownerId?: string | null;
};

export type Contact = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  title?: string | null;
  accountId: string;
};

export type Deal = {
  id: string;
  name: string;
  value?: number | null;
  stageId: string;
  pipelineId: string;
  accountId: string;
};

export type Task = {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate?: string | null;
  assignedUserId?: string | null;
  accountId?: string | null;
  dealId?: string | null;
};

export type Stage = {
  id: string;
  name: string;
  key: string;
  order: number;
  pipelineId: string;
};

export type Pipeline = {
  id: string;
  name: string;
};

export type User = {
  id: string;
  email: string;
  name?: string | null;
  roleId?: string | null;
  teamId?: string | null;
};

export type Role = {
  id: string;
  name: string;
};

export type Tenant = {
  id: string;
  name: string;
  slug: string;
};

export type Activity = {
  id: string;
  subject: string;
  type?: string | null;
  createdAt?: string;
};

export type Note = {
  id: string;
  body: string;
  createdAt?: string;
};

export type Attachment = {
  id: string;
  filename: string;
  createdAt?: string;
};

function normalizeListResponse<T>(response: { data: T[] | { items: T[] }; meta: PaginationMeta | null; error: { message: string } | null }) {
  const items = Array.isArray(response.data) ? response.data : response.data.items;
  return { ...response, data: { items } };
}

export async function login(email: string, password: string) {
  return apiFetch<{ accessToken: string; user: { id: string; tenantId: string; email: string; role: string; teamId?: string | null } }>(
    '/api/v1/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }
  );
}

export async function logout() {
  return apiFetch<{ success: boolean }>('/api/v1/auth/logout', {
    method: 'POST'
  });
}

export async function listAccounts(params: { page?: number; limit?: number; q?: string; ownerId?: string }) {
  const search = new URLSearchParams();
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  if (params.q) search.set('q', params.q);
  if (params.ownerId) search.set('ownerId', params.ownerId);
  const response = await apiFetch<Account[] | { items: Account[] }>(`/api/v1/accounts?${search.toString()}`);
  return normalizeListResponse(response);
}

export async function getAccount(id: string) {
  return apiFetch<Account>(`/api/v1/accounts/${id}`);
}

export async function createAccount(payload: { name: string; industry?: string | null; website?: string | null }) {
  return apiFetch<Account>('/api/v1/accounts', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function updateAccount(id: string, payload: { name?: string; industry?: string | null; website?: string | null }) {
  return apiFetch<Account>(`/api/v1/accounts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export async function listDeals(params: { page?: number; limit?: number; stageId?: string; accountId?: string }) {
  const search = new URLSearchParams();
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  if (params.stageId) search.set('stageId', params.stageId);
  if (params.accountId) search.set('accountId', params.accountId);
  const response = await apiFetch<Deal[] | { items: Deal[] }>(`/api/v1/deals?${search.toString()}`);
  return normalizeListResponse(response);
}

export async function createDeal(payload: { name: string; accountId: string; pipelineId: string; stageId: string; value?: number | null }) {
  return apiFetch<Deal>('/api/v1/deals', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function updateDeal(id: string, payload: { stageId?: string; name?: string; value?: number | null }) {
  return apiFetch<Deal>(`/api/v1/deals/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export async function listPipelines() {
  const response = await apiFetch<Pipeline[] | { items: Pipeline[] }>('/api/v1/pipelines');
  return normalizeListResponse(response);
}

export async function listStages(pipelineId?: string) {
  const search = new URLSearchParams();
  if (pipelineId) search.set('pipelineId', pipelineId);
  const response = await apiFetch<Stage[] | { items: Stage[] }>(`/api/v1/stages?${search.toString()}`);
  return normalizeListResponse(response);
}

export async function listTasks(params: { page?: number; limit?: number; assignedUserId?: string; accountId?: string; dealId?: string }) {
  const search = new URLSearchParams();
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  if (params.assignedUserId) search.set('assignedUserId', params.assignedUserId);
  if (params.accountId) search.set('accountId', params.accountId);
  if (params.dealId) search.set('dealId', params.dealId);
  const response = await apiFetch<Task[] | { items: Task[] }>(`/api/v1/tasks?${search.toString()}`);
  return normalizeListResponse(response);
}

export async function createTask(payload: { title: string; status: string; priority: string; dueDate?: string | null; assignedUserId?: string | null; accountId?: string | null; dealId?: string | null }) {
  return apiFetch<Task>('/api/v1/tasks', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function updateTask(id: string, payload: Partial<Task>) {
  return apiFetch<Task>(`/api/v1/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export async function listUsers() {
  const response = await apiFetch<User[] | { items: User[] }>('/api/v1/users');
  return normalizeListResponse(response);
}

export async function createUser(payload: { email: string; password: string; name?: string; roleId: string; teamId?: string }) {
  return apiFetch<User>('/api/v1/users', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function updateUser(id: string, payload: { name?: string; password?: string; roleId?: string; teamId?: string }) {
  return apiFetch<User>(`/api/v1/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export async function listRoles() {
  const response = await apiFetch<Role[] | { items: Role[] }>('/api/v1/roles');
  return normalizeListResponse(response);
}

export async function getTenant() {
  return apiFetch<Tenant>('/api/v1/tenant/me');
}

export async function listContacts(accountId: string) {
  const search = new URLSearchParams({ accountId });
  const response = await apiFetch<Contact[] | { items: Contact[] }>(`/api/v1/contacts?${search.toString()}`);
  return normalizeListResponse(response);
}

export async function listActivities(accountId: string) {
  const search = new URLSearchParams({ accountId });
  const response = await apiFetch<Activity[] | { items: Activity[] }>(`/api/v1/activities?${search.toString()}`);
  return normalizeListResponse(response);
}

export async function listNotes(accountId: string) {
  const search = new URLSearchParams({ accountId });
  const response = await apiFetch<Note[] | { items: Note[] }>(`/api/v1/notes?${search.toString()}`);
  return normalizeListResponse(response);
}

export async function listAttachments(accountId: string) {
  const search = new URLSearchParams({ accountId });
  const response = await apiFetch<Attachment[] | { items: Attachment[] }>(`/api/v1/attachments?${search.toString()}`);
  return normalizeListResponse(response);
}
