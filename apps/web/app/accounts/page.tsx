import Link from 'next/link';

const accounts = [
  { id: '1', name: 'Northwind Traders', industry: 'Manufacturing', owner: 'Ava Diaz' },
  { id: '2', name: 'Lumina Health', industry: 'Healthcare', owner: 'James Lee' }
];

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Accounts</h2>
          <p className="text-slate-600">Manage your customer organizations.</p>
        </div>
        <button className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white">New Account</button>
      </div>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Industry</th>
              <th className="px-4 py-2">Owner</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id} className="border-t border-slate-200">
                <td className="px-4 py-3">
                  <Link className="text-slate-900 hover:underline" href={`/accounts/${account.id}`}>
                    {account.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-600">{account.industry}</td>
                <td className="px-4 py-3 text-slate-600">{account.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
