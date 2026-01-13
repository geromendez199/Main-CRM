'use client';

import { useEffect } from 'react';
import { Button } from '@maincrm/ui';
import { useTranslations } from 'next-intl';

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  const t = useTranslations('errors');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-semibold text-slate-900">{t('title')}</h2>
      <p className="text-sm text-slate-500">{t('body')}</p>
      <Button onClick={() => reset()}>{t('retry')}</Button>
    </div>
  );
}
