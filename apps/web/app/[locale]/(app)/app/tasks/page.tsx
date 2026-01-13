'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Skeleton, Table, TableCell, TableHead, TableHeaderCell, TableRow } from '@maincrm/ui';
import { useAccounts, useCreateTask, useTasks, useUsers } from '../../../../lib/queries';
import { TaskPriority, TaskStatus } from '@maincrm/shared';
import { useToast } from '@maincrm/ui';

type TaskFormValues = {
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  accountId?: string;
};

export default function TasksPage() {
  const t = useTranslations('tasks');
  const tActions = useTranslations('app.actions');
  const [open, setOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [ownerFilter, setOwnerFilter] = useState<string>('all');
  const [dueFilter, setDueFilter] = useState<string>('all');
  const { addToast } = useToast();
  const tasksQuery = useTasks({ page: 1, limit: 50 });
  const accountsQuery = useAccounts({ page: 1, limit: 100 });
  const usersQuery = useUsers();
  const createTask = useCreateTask();

  const taskSchema = z.object({
    title: z.string().min(2, t('validation.title')),
    status: z.nativeEnum(TaskStatus),
    priority: z.nativeEnum(TaskPriority),
    dueDate: z.string().optional(),
    accountId: z.string().optional()
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      status: TaskStatus.OPEN,
      priority: TaskPriority.MEDIUM
    }
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createTask.mutateAsync({
        title: values.title,
        status: values.status,
        priority: values.priority,
        dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : null,
        accountId: values.accountId || null
      });
      addToast({ title: t('newTask'), variant: 'success' });
      setOpen(false);
    } catch {
      addToast({ title: t('newTask'), variant: 'error' });
    }
  });

  const tasks = tasksQuery.data?.data.items ?? [];

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (statusFilter !== 'all' && task.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
      if (ownerFilter !== 'all' && task.assignedUserId !== ownerFilter) return false;
      if (dueFilter !== 'all' && task.dueDate) {
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (dueFilter === 'overdue' && dueDate >= today) return false;
        if (dueFilter === 'today' && dueDate.toDateString() !== today.toDateString()) return false;
        if (dueFilter === 'upcoming' && dueDate <= today) return false;
      }
      return true;
    });
  }, [tasks, statusFilter, priorityFilter, ownerFilter, dueFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{t('title')}</h1>
          <p className="text-sm text-slate-500">{t('subtitle')}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <Button onClick={() => setOpen(true)}>{t('newTask')}</Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('newTask')}</DialogTitle>
              <DialogDescription>{t('subtitle')}</DialogDescription>
            </DialogHeader>
            <form className="mt-4 space-y-4" onSubmit={onSubmit}>
              <div>
                <label className="text-sm font-medium text-slate-700">{t('taskTitle')}</label>
                <Input placeholder={t('placeholders.title')} {...register('title')} />
                {errors.title ? <p className="mt-1 text-xs text-red-600">{errors.title.message}</p> : null}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-700">{t('status')}</label>
                  <Select onValueChange={(value) => setValue('status', value as TaskStatus)} defaultValue={TaskStatus.OPEN}>
                    <SelectTrigger aria-label={t('status')}>
                      <SelectValue placeholder={t('status')} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(TaskStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {t(`statusValues.${status}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">{t('priority')}</label>
                  <Select onValueChange={(value) => setValue('priority', value as TaskPriority)} defaultValue={TaskPriority.MEDIUM}>
                    <SelectTrigger aria-label={t('priority')}>
                      <SelectValue placeholder={t('priority')} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(TaskPriority).map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {t(`priorityValues.${priority}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-700">{t('due')}</label>
                  <Input type="date" {...register('dueDate')} />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">{t('account')}</label>
                  <Select onValueChange={(value) => setValue('accountId', value)}>
                    <SelectTrigger aria-label={t('account')}>
                      <SelectValue placeholder={t('account')} />
                    </SelectTrigger>
                    <SelectContent>
                      {(accountsQuery.data?.data.items ?? []).map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  {tActions('cancel')}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {tActions('create')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <div className="grid gap-3 md:grid-cols-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger aria-label={t('status')}>
                <SelectValue placeholder={t('status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.allStatuses')}</SelectItem>
                {Object.values(TaskStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {t(`statusValues.${status}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger aria-label={t('priority')}>
                <SelectValue placeholder={t('priority')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.allPriorities')}</SelectItem>
                {Object.values(TaskPriority).map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {t(`priorityValues.${priority}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={ownerFilter} onValueChange={setOwnerFilter}>
              <SelectTrigger aria-label={t('owner')}>
                <SelectValue placeholder={t('owner')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.allOwners')}</SelectItem>
                {(usersQuery.data?.data.items ?? []).map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={dueFilter} onValueChange={setDueFilter}>
              <SelectTrigger aria-label={t('due')}>
                <SelectValue placeholder={t('due')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.anyDue')}</SelectItem>
                <SelectItem value="overdue">{t('filters.overdue')}</SelectItem>
                <SelectItem value="today">{t('filters.dueToday')}</SelectItem>
                <SelectItem value="upcoming">{t('filters.upcoming')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Table>
          <TableHead>
            <TableRow className="border-none">
              <TableHeaderCell>{t('taskTitle')}</TableHeaderCell>
              <TableHeaderCell>{t('status')}</TableHeaderCell>
              <TableHeaderCell>{t('priority')}</TableHeaderCell>
              <TableHeaderCell>{t('due')}</TableHeaderCell>
            </TableRow>
          </TableHead>
          <tbody>
            {tasksQuery.isLoading ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <Skeleton className="h-6 w-full" />
                </TableCell>
              </TableRow>
            ) : (
              filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium text-slate-900">{task.title}</TableCell>
                  <TableCell className="text-slate-600">{t(`statusValues.${task.status}`)}</TableCell>
                  <TableCell className="text-slate-600">{t(`priorityValues.${task.priority}`)}</TableCell>
                  <TableCell className="text-slate-600">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</TableCell>
                </TableRow>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
