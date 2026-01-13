'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, Kanban, CheckSquare2, Settings } from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { key: 'dashboard', href: '/app', icon: LayoutDashboard },
  { key: 'accounts', href: '/app/accounts', icon: Building2 },
  { key: 'deals', href: '/app/deals', icon: Kanban },
  { key: 'tasks', href: '/app/tasks', icon: CheckSquare2 },
  { key: 'settings', href: '/app/settings', icon: Settings }
];

export function Sidebar() {
  const t = useTranslations('app.nav');
  const tApp = useTranslations('app');
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-slate-200 bg-white p-6 lg:flex">
      <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">M</span>
        <span>{tApp('name')}</span>
      </div>
      <nav className="mt-10 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const href = `/${locale}${item.href}`;
          const isActive = pathname?.startsWith(href);
          return (
            <Link
              key={item.key}
              href={href}
              className={clsx(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition',
                isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              )}
            >
              <Icon className="h-4 w-4" />
              {t(item.key)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
