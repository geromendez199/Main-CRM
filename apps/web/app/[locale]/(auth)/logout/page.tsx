'use client';

import { useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useLogout } from '../../../../lib/use-session';
import { Skeleton } from '@maincrm/ui';

export default function LogoutPage() {
  const logout = useLogout();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('auth');

  useEffect(() => {
    const handleLogout = async () => {
      await logout();
      router.replace(`/${locale}/login`);
    };
    handleLogout();
  }, [logout, router, locale]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Skeleton className="h-6 w-40" />
      <span className="sr-only">{t('logout')}</span>
    </div>
  );
}
