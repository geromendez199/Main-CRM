import Link from 'next/link';

const settingsItems = [
  { href: '/settings/users', label: 'Users' },
  { href: '/settings/roles', label: 'Roles' }
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Settings</h2>
        <p className="text-slate-600">Manage workspace preferences.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {settingsItems.map((item) => (
          <Link key={item.href} href={item.href} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="font-medium text-slate-900">{item.label}</p>
            <p className="text-sm text-slate-500">Configure {item.label.toLowerCase()} settings.</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
