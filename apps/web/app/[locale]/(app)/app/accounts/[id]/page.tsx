'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger, Badge, Skeleton, Table, TableCell, TableHead, TableHeaderCell, TableRow } from '@maincrm/ui';
import { useAccount, useAccountActivities, useAccountAttachments, useAccountContacts, useAccountNotes, useDeals, useTasks } from '../../../../../lib/queries';

export default function AccountDetailPage() {
  const t = useTranslations('accounts');
  const tEmpty = useTranslations('empty');
  const params = useParams();
  const id = params?.id as string;

  const accountQuery = useAccount(id);
  const contactsQuery = useAccountContacts(id);
  const dealsQuery = useDeals({ accountId: id });
  const activitiesQuery = useAccountActivities(id);
  const tasksQuery = useTasks({ accountId: id });
  const notesQuery = useAccountNotes(id);
  const attachmentsQuery = useAccountAttachments(id);

  if (accountQuery.isLoading) {
    return <Skeleton className="h-8 w-48" />;
  }

  const account = accountQuery.data?.data;
  if (!account) {
    return <p className="text-sm text-slate-500">{tEmpty('genericBody')}</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{account.name}</h1>
        <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-500">
          {account.industry ? <Badge>{account.industry}</Badge> : null}
          {account.website ? <span>{account.website}</span> : null}
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">{t('detail.overview')}</TabsTrigger>
          <TabsTrigger value="contacts">{t('detail.contacts')}</TabsTrigger>
          <TabsTrigger value="deals">{t('detail.deals')}</TabsTrigger>
          <TabsTrigger value="activities">{t('detail.activities')}</TabsTrigger>
          <TabsTrigger value="tasks">{t('detail.tasks')}</TabsTrigger>
          <TabsTrigger value="notes">{t('detail.notes')}</TabsTrigger>
          <TabsTrigger value="attachments">{t('detail.attachments')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">{t('detail.overview')}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase text-slate-400">{t('fields.name')}</p>
              <p className="text-sm text-slate-700">{account.name}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-400">{t('fields.industry')}</p>
              <p className="text-sm text-slate-700">{account.industry ?? '-'}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-400">{t('fields.website')}</p>
              <p className="text-sm text-slate-700">{account.website ?? '-'}</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contacts">
          <DataTable
            title={t('detail.contacts')}
            headers={[t('detail.contacts')]}
            rows={(contactsQuery.data?.data.items ?? []).map((contact) => [contact.name])}
            isLoading={contactsQuery.isLoading}
            emptyMessage={tEmpty('genericBody')}
          />
        </TabsContent>

        <TabsContent value="deals">
          <DataTable
            title={t('detail.deals')}
            headers={[t('detail.deals')]}
            rows={(dealsQuery.data?.data.items ?? []).map((deal) => [deal.name])}
            isLoading={dealsQuery.isLoading}
            emptyMessage={tEmpty('genericBody')}
          />
        </TabsContent>

        <TabsContent value="activities">
          <DataTable
            title={t('detail.activities')}
            headers={[t('detail.activities')]}
            rows={(activitiesQuery.data?.data.items ?? []).map((activity) => [activity.subject])}
            isLoading={activitiesQuery.isLoading}
            emptyMessage={tEmpty('genericBody')}
          />
        </TabsContent>

        <TabsContent value="tasks">
          <DataTable
            title={t('detail.tasks')}
            headers={[t('detail.tasks')]}
            rows={(tasksQuery.data?.data.items ?? []).map((task) => [task.title])}
            isLoading={tasksQuery.isLoading}
            emptyMessage={tEmpty('genericBody')}
          />
        </TabsContent>

        <TabsContent value="notes">
          <DataTable
            title={t('detail.notes')}
            headers={[t('detail.notes')]}
            rows={(notesQuery.data?.data.items ?? []).map((note) => [note.body])}
            isLoading={notesQuery.isLoading}
            emptyMessage={tEmpty('genericBody')}
          />
        </TabsContent>

        <TabsContent value="attachments">
          <DataTable
            title={t('detail.attachments')}
            headers={[t('detail.attachments')]}
            rows={(attachmentsQuery.data?.data.items ?? []).map((attachment) => [attachment.filename])}
            isLoading={attachmentsQuery.isLoading}
            emptyMessage={tEmpty('genericBody')}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DataTable({
  title,
  headers,
  rows,
  isLoading,
  emptyMessage
}: {
  title: string;
  headers: string[];
  rows: string[][];
  isLoading: boolean;
  emptyMessage: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      </div>
      <Table>
        <TableHead>
          <TableRow className="border-none">
            {headers.map((header) => (
              <TableHeaderCell key={header}>{header}</TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <tbody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={headers.length}>
                <Skeleton className="h-6 w-full" />
              </TableCell>
            </TableRow>
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={headers.length} className="text-sm text-slate-500">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, index) => (
              <TableRow key={index}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex}>{cell}</TableCell>
                ))}
              </TableRow>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}
