'use client';

import { ReactNode, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useSession } from '../../lib/use-session';
import { Skeleton } from '@maincrm/ui';

export function AuthGuard({ children }: { children: ReactNode }) {
  const { data, isLoading } = useSession();
  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !data?.user) {
      router.replace(`/${locale}/login`);
    }
  }, [data, isLoading, locale, router]);

  if (isLoading || !data?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Skeleton className="h-8 w-40" />
      </div>
    );
  }

  return <>{children}</>;
}
