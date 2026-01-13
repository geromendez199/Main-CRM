const roles = [
  { name: 'Admin', permissions: 'All permissions' },
  { name: 'Manager', permissions: 'Manage accounts and deals' },
  { name: 'User', permissions: 'Create and update records' },
  { name: 'Read Only', permissions: 'Read-only access' }
];

export default function RolesSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Roles</h2>
          <p className="text-slate-600">Control access across your workspace.</p>
        </div>
        <button className="rounded-md border border-slate-200 px-4 py-2 text-sm">Create Role</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {roles.map((role) => (
          <div key={role.name} className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="font-semibold text-slate-900">{role.name}</h3>
            <p className="mt-2 text-sm text-slate-600">{role.permissions}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
