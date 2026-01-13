'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Search, ChevronDown } from 'lucide-react';
import { useMemo } from 'react';
import { Avatar, AvatarFallback, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@maincrm/ui';
import { useSession, useLogout } from '../lib/use-session';

export function Topbar() {
  const t = useTranslations('app.nav');
  const tApp = useTranslations('app');
  const tLanguage = useTranslations('language');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useSession();
  const logout = useLogout();

  const displayName = useMemo(() => {
    if (!data?.user?.email) return tApp('userFallback');
    return data.user.email.split('@')[0];
  }, [data, tApp]);

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-3 lg:px-6">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          className="pl-9"
          placeholder={t('search')}
          aria-label={t('search')}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              const value = (event.target as HTMLInputElement).value;
              router.push(`/${locale}/app/accounts?q=${encodeURIComponent(value)}`);
            }
          }}
        />
      </div>

      <div className="flex items-center gap-3">
        <Select
          value={locale}
          onValueChange={(nextLocale) => {
            if (!pathname) return;
            const segments = pathname.split('/');
            segments[1] = nextLocale;
            document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
            router.push(segments.join('/'));
          }}
        >
          <SelectTrigger className="w-[140px]" aria-label={tLanguage('label')}>
            <SelectValue placeholder={tLanguage('label')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">{tLanguage('english')}</SelectItem>
            <SelectItem value="es">{tLanguage('spanish')}</SelectItem>
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700">
              <Avatar className="h-7 w-7">
                <AvatarFallback>{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline">{displayName}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => router.push(`/${locale}/app/profile`)}>{t('profile')}</DropdownMenuItem>
            <DropdownMenuItem
              onSelect={async () => {
                await logout();
                router.push(`/${locale}/login`);
              }}
            >
              {t('logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
