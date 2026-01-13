'use client';

import { useTranslations } from 'next-intl';
import { Skeleton } from '@maincrm/ui';
import { useAccounts, useDeals, usePipelines, useStages, useTasks } from '../../../../lib/queries';
import { DealStageKey } from '@maincrm/shared';

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const accountsQuery = useAccounts({ page: 1, limit: 50 });
  const dealsQuery = useDeals({ page: 1, limit: 100 });
  const tasksQuery = useTasks({ page: 1, limit: 50 });
  const pipelinesQuery = usePipelines();
  const pipelineId = pipelinesQuery.data?.data.items[0]?.id;
  const stagesQuery = useStages(pipelineId);

  const accountsCount = accountsQuery.data?.data.items.length ?? 0;
  const deals = dealsQuery.data?.data.items ?? [];
  const openDeals = deals.length;
  const wonStageIds = (stagesQuery.data?.data.items ?? [])
    .filter((stage) => stage.key === DealStageKey.WON)
    .map((stage) => stage.id);
  const wonDeals = deals.filter((deal) => wonStageIds.includes(deal.stageId)).length;
  const tasksDue = tasksQuery.data?.data.items.length ?? 0;

  const kpis = [
    { label: t('kpis.accounts'), value: accountsCount },
    { label: t('kpis.openDeals'), value: openDeals },
    { label: t('kpis.wonDeals'), value: wonDeals },
    { label: t('kpis.tasksDue'), value: tasksDue }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{t('title')}</h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">{kpi.label}</p>
            {accountsQuery.isLoading || dealsQuery.isLoading || tasksQuery.isLoading ? (
              <Skeleton className="mt-3 h-8 w-20" />
            ) : (
              <p className="mt-2 text-2xl font-semibold text-slate-900">{kpi.value}</p>
            )}
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{t('activityTitle')}</h2>
        {dealsQuery.isLoading ? (
          <Skeleton className="mt-4 h-6 w-64" />
        ) : deals.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">{t('activityEmpty')}</p>
        ) : (
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {deals.slice(0, 5).map((deal) => (
              <li key={deal.id} className="flex items-center justify-between">
                <span>{deal.name}</span>
                <span className="text-xs text-slate-400">{deal.stageId}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
