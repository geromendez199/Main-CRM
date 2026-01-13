const users = [
  { name: 'Ava Diaz', role: 'Admin', email: 'ava@maincrm.local' },
  { name: 'James Lee', role: 'Manager', email: 'james@maincrm.local' }
];

export default function UsersSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Users</h2>
          <p className="text-slate-600">Invite and manage team members.</p>
        </div>
        <button className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white">Invite User</button>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.email} className="border-t border-slate-200">
                <td className="px-4 py-3 text-slate-900">{user.name}</td>
                <td className="px-4 py-3 text-slate-600">{user.role}</td>
                <td className="px-4 py-3 text-slate-600">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
