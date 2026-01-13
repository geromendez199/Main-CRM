import Link from 'next/link';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/accounts', label: 'Accounts' },
  { href: '/deals', label: 'Pipeline' },
  { href: '/tasks', label: 'Tasks' },
  { href: '/settings', label: 'Settings' }
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 px-4 py-6">
      <div className="text-xl font-semibold mb-6">Main CRM</div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
