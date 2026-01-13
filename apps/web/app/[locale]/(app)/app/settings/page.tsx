'use client';

import { useTranslations } from 'next-intl';
import { Skeleton, Table, TableCell, TableHead, TableHeaderCell, TableRow } from '@maincrm/ui';
import { useRoles, useUsers } from '../../../../lib/queries';

export default function SettingsPage() {
  const t = useTranslations('settings');
  const usersQuery = useUsers();
  const rolesQuery = useRoles();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{t('title')}</h1>
        <p className="text-sm text-slate-500">{t('subtitle')}</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">{t('users')}</h2>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <Table>
            <TableHead>
              <TableRow className="border-none">
                <TableHeaderCell>{t('emailLabel')}</TableHeaderCell>
                <TableHeaderCell>{t('nameLabel')}</TableHeaderCell>
              </TableRow>
            </TableHead>
            <tbody>
              {usersQuery.isLoading ? (
                <TableRow>
                  <TableCell colSpan={2}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ) : (
                (usersQuery.data?.data.items ?? []).map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium text-slate-900">{user.email}</TableCell>
                    <TableCell className="text-slate-600">{user.name ?? '-'}</TableCell>
                  </TableRow>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">{t('roles')}</h2>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <Table>
            <TableHead>
              <TableRow className="border-none">
                <TableHeaderCell>{t('roleLabel')}</TableHeaderCell>
              </TableRow>
            </TableHead>
            <tbody>
              {rolesQuery.isLoading ? (
                <TableRow>
                  <TableCell colSpan={1}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ) : (
                (rolesQuery.data?.data.items ?? []).map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium text-slate-900">{role.name}</TableCell>
                  </TableRow>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </section>
    </div>
  );
}
