'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Skeleton, Table, TableCell, TableHead, TableHeaderCell, TableRow } from '@maincrm/ui';
import { useAccounts, useCreateAccount, useUsers } from '../../../../lib/queries';
import { useToast } from '@maincrm/ui';

type AccountFormValues = {
  name: string;
  industry?: string;
  website?: string;
};

export default function AccountsPage() {
  const t = useTranslations('accounts');
  const tActions = useTranslations('app.actions');
  const tFilters = useTranslations('accounts.filters');
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get('q') ?? '';
  const [page, setPage] = useState(1);
  const [ownerFilter, setOwnerFilter] = useState('all');
  const [searchValue, setSearchValue] = useState(search);
  const [open, setOpen] = useState(false);
  const { addToast } = useToast();
  useEffect(() => {
    setPage(1);
  }, [searchValue, ownerFilter]);

  const accountsQuery = useAccounts({ page, limit: 20, q: searchValue || undefined, ownerId: ownerFilter === 'all' ? undefined : ownerFilter });
  const usersQuery = useUsers();
  const createAccount = useCreateAccount();

  const accountSchema = z.object({
    name: z.string().min(2, t('validation.name')),
    industry: z.string().optional(),
    website: z.string().url(t('validation.website')).optional().or(z.literal(''))
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema)
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createAccount.mutateAsync({
        name: values.name,
        industry: values.industry || null,
        website: values.website || null
      });
      addToast({ title: `${t('newAccount')} ${tActions('create')}`, variant: 'success' });
      reset();
      setOpen(false);
    } catch (error) {
      addToast({ title: `${t('newAccount')} ${tActions('create')}`, variant: 'error' });
    }
  });

  const accounts = accountsQuery.data?.data.items ?? [];
  const total = accountsQuery.data?.meta?.total as number | undefined;
  const totalPages = total ? Math.ceil(total / 20) : 1;
  const isLoading = accountsQuery.isLoading;

  const emptyState = !isLoading && accounts.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{t('title')}</h1>
          <p className="text-sm text-slate-500">{t('subtitle')}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <Button onClick={() => setOpen(true)} data-testid="new-account-button">
            {t('newAccount')}
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('newAccount')}</DialogTitle>
              <DialogDescription>{t('subtitle')}</DialogDescription>
            </DialogHeader>
            <form className="mt-4 space-y-4" onSubmit={onSubmit}>
              <div>
                <label className="text-sm font-medium text-slate-700">{t('fields.name')}</label>
                <Input placeholder={t('placeholders.name')} {...register('name')} data-testid="account-name-input" />
                {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name.message}</p> : null}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">{t('fields.industry')}</label>
                <Input placeholder={t('placeholders.industry')} {...register('industry')} data-testid="account-industry-input" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">{t('fields.website')}</label>
                <Input placeholder={t('placeholders.website')} {...register('website')} data-testid="account-website-input" />
                {errors.website ? <p className="mt-1 text-xs text-red-600">{errors.website.message}</p> : null}
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  {tActions('cancel')}
                </Button>
                <Button type="submit" disabled={isSubmitting} data-testid="account-submit">
                  {tActions('create')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <Input
            placeholder={t('fields.name')}
            aria-label={t('fields.name')}
            value={searchValue}
            onChange={(event) => {
              const nextValue = event.target.value;
              setSearchValue(nextValue);
              const nextUrl = nextValue ? `/${locale}/app/accounts?q=${encodeURIComponent(nextValue)}` : `/${locale}/app/accounts`;
              router.replace(nextUrl);
            }}
          />
          <Select value={ownerFilter} onValueChange={setOwnerFilter}>
            <SelectTrigger aria-label={tFilters('owner')}>
              <SelectValue placeholder={tFilters('owner')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{tFilters('allOwners')}</SelectItem>
              {(usersQuery.data?.data.items ?? []).map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {emptyState ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <h3 className="text-lg font-semibold text-slate-900">{t('emptyTitle')}</h3>
          <p className="mt-2 text-sm text-slate-500">{t('emptyBody')}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <Table>
            <TableHead>
              <TableRow className="border-none">
                <TableHeaderCell>{t('fields.name')}</TableHeaderCell>
                <TableHeaderCell>{t('fields.industry')}</TableHeaderCell>
                <TableHeaderCell>{t('fields.website')}</TableHeaderCell>
                <TableHeaderCell>{tActions('view')}</TableHeaderCell>
              </TableRow>
            </TableHead>
            <tbody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ) : (
                accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium text-slate-900">{account.name}</TableCell>
                    <TableCell className="text-slate-600">{account.industry ?? '-'}</TableCell>
                    <TableCell className="text-slate-600">{account.website ?? '-'}</TableCell>
                    <TableCell>
                      <Link className="text-slate-900 underline" href={`/${locale}/app/accounts/${account.id}`}>
                        {tActions('view')}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </tbody>
          </Table>
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>{tFilters('page', { page, total: totalPages })}</span>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page === 1}>
            {tActions('back')}
          </Button>
          <Button variant="outline" onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={page >= totalPages}>
            {tActions('next')}
          </Button>
        </div>
      </div>
    </div>
  );
}
