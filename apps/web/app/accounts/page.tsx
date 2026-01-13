'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';

const initialAccounts = [
  { id: '1', name: 'Northwind Traders', industry: 'Manufacturing', owner: 'Ava Diaz' },
  { id: '2', name: 'Lumina Health', industry: 'Healthcare', owner: 'James Lee' }
];

export default function AccountsPage() {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [isCreating, setIsCreating] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    industry: '',
    owner: ''
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.name.trim()) {
      return;
    }
    const newAccount = {
      id: crypto.randomUUID(),
      name: formState.name.trim(),
      industry: formState.industry.trim() || 'Unspecified',
      owner: formState.owner.trim() || 'Unassigned'
    };
    setAccounts((prev) => [newAccount, ...prev]);
    setFormState({ name: '', industry: '', owner: '' });
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Accounts</h2>
          <p className="text-slate-600">Manage your customer organizations.</p>
        </div>
        <button
          className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white"
          onClick={() => setIsCreating(true)}
          data-testid="new-account-button"
        >
          New Account
        </button>
      </div>

      {isCreating ? (
        <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">Account name</label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                placeholder="Acme Corp"
                value={formState.name}
                onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
                data-testid="account-name-input"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">Industry</label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                placeholder="Software"
                value={formState.industry}
                onChange={(event) => setFormState((prev) => ({ ...prev, industry: event.target.value }))}
                data-testid="account-industry-input"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">Owner</label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                placeholder="Jordan Smith"
                value={formState.owner}
                onChange={(event) => setFormState((prev) => ({ ...prev, owner: event.target.value }))}
                data-testid="account-owner-input"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-700"
              onClick={() => setIsCreating(false)}
            >
              Cancel
            </button>
            <button type="submit" className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white" data-testid="account-submit">
              Create account
            </button>
          </div>
        </form>
      ) : null}

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
