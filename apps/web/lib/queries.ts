'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createAccount,
  createDeal,
  createTask,
  createUser,
  getAccount,
  getTenant,
  listAccounts,
  listActivities,
  listAttachments,
  listContacts,
  listDeals,
  listNotes,
  listPipelines,
  listRoles,
  listStages,
  listTasks,
  listUsers,
  updateAccount,
  updateDeal,
  updateTask,
  updateUser
} from './api';

export function useAccounts(query: { page?: number; limit?: number; q?: string; ownerId?: string }) {
  return useQuery({
    queryKey: ['accounts', query],
    queryFn: () => listAccounts(query)
  });
}

export function useAccount(id: string) {
  return useQuery({
    queryKey: ['account', id],
    queryFn: () => getAccount(id),
    enabled: Boolean(id)
  });
}

export function useDeals(query: { page?: number; limit?: number; stageId?: string; accountId?: string }) {
  return useQuery({
    queryKey: ['deals', query],
    queryFn: () => listDeals(query)
  });
}

export function useTasks(query: { page?: number; limit?: number; assignedUserId?: string; accountId?: string; dealId?: string }) {
  return useQuery({
    queryKey: ['tasks', query],
    queryFn: () => listTasks(query)
  });
}

export function usePipelines() {
  return useQuery({
    queryKey: ['pipelines'],
    queryFn: () => listPipelines()
  });
}

export function useStages(pipelineId?: string) {
  return useQuery({
    queryKey: ['stages', pipelineId],
    queryFn: () => listStages(pipelineId)
  });
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => listUsers()
  });
}

export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => listRoles()
  });
}

export function useTenant() {
  return useQuery({
    queryKey: ['tenant'],
    queryFn: () => getTenant()
  });
}

export function useAccountContacts(accountId: string) {
  return useQuery({
    queryKey: ['contacts', accountId],
    queryFn: () => listContacts(accountId),
    enabled: Boolean(accountId)
  });
}

export function useAccountActivities(accountId: string) {
  return useQuery({
    queryKey: ['activities', accountId],
    queryFn: () => listActivities(accountId),
    enabled: Boolean(accountId)
  });
}

export function useAccountNotes(accountId: string) {
  return useQuery({
    queryKey: ['notes', accountId],
    queryFn: () => listNotes(accountId),
    enabled: Boolean(accountId)
  });
}

export function useAccountAttachments(accountId: string) {
  return useQuery({
    queryKey: ['attachments', accountId],
    queryFn: () => listAttachments(accountId),
    enabled: Boolean(accountId)
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAccount,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts'] })
  });
}

export function useUpdateAccount(accountId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Parameters<typeof updateAccount>[1]) => updateAccount(accountId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['account', accountId] });
    }
  });
}

export function useCreateDeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDeal,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['deals'] })
  });
}

export function useUpdateDeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof updateDeal>[1] }) => updateDeal(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['deals'] })
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] })
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof updateTask>[1] }) => updateTask(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] })
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
  });
}

export function useUpdateUser(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Parameters<typeof updateUser>[1]) => updateUser(userId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] })
  });
}
