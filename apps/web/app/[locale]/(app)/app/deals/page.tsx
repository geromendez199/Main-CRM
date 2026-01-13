'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Skeleton, Badge } from '@maincrm/ui';
import { useAccounts, useCreateDeal, useDeals, usePipelines, useStages, useUpdateDeal } from '../../../../lib/queries';
import { useToast } from '@maincrm/ui';
import type { Deal } from '../../../../lib/api';

type DealFormValues = {
  name: string;
  accountId: string;
  pipelineId: string;
  stageId: string;
  value?: string;
};

export default function DealsPage() {
  const t = useTranslations('deals');
  const tActions = useTranslations('app.actions');
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [open, setOpen] = useState(false);

  const dealsQuery = useDeals({ page: 1, limit: 200 });
  const pipelinesQuery = usePipelines();
  const pipelineId = pipelinesQuery.data?.data.items[0]?.id;
  const stagesQuery = useStages(pipelineId);
  const accountsQuery = useAccounts({ page: 1, limit: 100 });
  const createDeal = useCreateDeal();
  const updateDeal = useUpdateDeal();

  const stages = stagesQuery.data?.data.items ?? [];
  const deals = dealsQuery.data?.data.items ?? [];

  const dealSchema = z.object({
    name: z.string().min(2, t('validation.name')),
    accountId: z.string().min(1, t('validation.required')),
    pipelineId: z.string().min(1, t('validation.required')),
    stageId: z.string().min(1, t('validation.required')),
    value: z.string().optional()
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<DealFormValues>({
    resolver: zodResolver(dealSchema)
  });

  useEffect(() => {
    if (pipelineId) {
      setValue('pipelineId', pipelineId);
    }
  }, [pipelineId, setValue]);

  useEffect(() => {
    if (stages[0]) {
      setValue('stageId', stages[0].id);
    }
  }, [stages, setValue]);

  useEffect(() => {
    const firstAccount = accountsQuery.data?.data.items[0];
    if (firstAccount) {
      setValue('accountId', firstAccount.id);
    }
  }, [accountsQuery.data, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createDeal.mutateAsync({
        name: values.name,
        accountId: values.accountId,
        pipelineId: values.pipelineId,
        stageId: values.stageId,
        value: values.value ? Number(values.value) : null
      });
      addToast({ title: t('newDeal'), variant: 'success' });
      setOpen(false);
    } catch {
      addToast({ title: t('newDeal'), variant: 'error' });
    }
  });

  const dealsQueryKey = ['deals', { page: 1, limit: 200 }];

  const dealsByStage = useMemo(() => {
    const map = new Map<string, Deal[]>();
    stages.forEach((stage) => map.set(stage.id, []));
    deals.forEach((deal) => {
      map.set(deal.stageId, [...(map.get(deal.stageId) ?? []), deal]);
    });
    return map;
  }, [stages, deals]);

  const handleStageChange = async (dealId: string, stageId: string) => {
    const previousDeals = queryClient.getQueryData(dealsQueryKey);
    queryClient.setQueryData(dealsQueryKey, (data: any) => {
      if (!data) return data;
      return {
        ...data,
        data: {
          ...data.data,
          items: data.data.items.map((deal: Deal) => (deal.id === dealId ? { ...deal, stageId } : deal))
        }
      };
    });
    try {
      await updateDeal.mutateAsync({ id: dealId, payload: { stageId } });
      addToast({ title: t('pipeline'), variant: 'success' });
    } catch {
      queryClient.setQueryData(dealsQueryKey, previousDeals);
      addToast({ title: t('pipeline'), variant: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{t('title')}</h1>
          <p className="text-sm text-slate-500">{t('subtitle')}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <Button onClick={() => setOpen(true)}>{t('newDeal')}</Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('newDeal')}</DialogTitle>
              <DialogDescription>{t('subtitle')}</DialogDescription>
            </DialogHeader>
            <form className="mt-4 space-y-4" onSubmit={onSubmit}>
              <div>
                <label className="text-sm font-medium text-slate-700">{t('dealName')}</label>
                <Input placeholder={t('placeholders.name')} {...register('name')} />
                {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name.message}</p> : null}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">{t('account')}</label>
                <Select value={watch('accountId')} onValueChange={(value) => setValue('accountId', value)}>
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
                {errors.accountId ? <p className="mt-1 text-xs text-red-600">{errors.accountId.message}</p> : null}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">{t('pipeline')}</label>
                <Select value={watch('pipelineId')} onValueChange={(value) => setValue('pipelineId', value)}>
                  <SelectTrigger aria-label={t('pipeline')}>
                    <SelectValue placeholder={t('pipeline')} />
                  </SelectTrigger>
                  <SelectContent>
                    {(pipelinesQuery.data?.data.items ?? []).map((pipeline) => (
                      <SelectItem key={pipeline.id} value={pipeline.id}>
                        {pipeline.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.pipelineId ? <p className="mt-1 text-xs text-red-600">{errors.pipelineId.message}</p> : null}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">{t('stage')}</label>
                <Select value={watch('stageId')} onValueChange={(value) => setValue('stageId', value)}>
                  <SelectTrigger aria-label={t('stage')}>
                    <SelectValue placeholder={t('stage')} />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id}>
                        {stage.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.stageId ? <p className="mt-1 text-xs text-red-600">{errors.stageId.message}</p> : null}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">{t('value')}</label>
                <Input placeholder={t('placeholders.value')} {...register('value')} />
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

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">{t('pipeline')}</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {(stagesQuery.isLoading ? [1, 2, 3] : stages).map((stage, index) => (
            <div key={typeof stage === 'number' ? stage : stage.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">
                  {typeof stage === 'number' ? <Skeleton className="h-5 w-24" /> : stage.name}
                </h3>
                <Badge>{typeof stage === 'number' ? '-' : dealsByStage.get(stage.id)?.length ?? 0}</Badge>
              </div>
              <div className="mt-4 space-y-3">
                {typeof stage === 'number' ? (
                  <Skeleton className="h-20 w-full" />
                ) : (dealsByStage.get(stage.id) ?? []).length === 0 ? (
                  <p className="text-xs text-slate-400">{t('empty')}</p>
                ) : (
                  (dealsByStage.get(stage.id) ?? []).map((deal) => (
                    <div key={deal.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <p className="text-sm font-medium text-slate-900">{deal.name}</p>
                      <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                        <span>{deal.value ? `$${deal.value}` : t('value')}</span>
                        <Select
                          value={deal.stageId}
                          onValueChange={(value) => handleStageChange(deal.id, value)}
                        >
                          <SelectTrigger className="h-7 w-[110px] text-xs" aria-label={t('stage')}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {stages.map((stageOption) => (
                              <SelectItem key={stageOption.id} value={stageOption.id}>
                                {stageOption.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
