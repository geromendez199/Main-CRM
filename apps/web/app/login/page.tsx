'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Sign in</h2>
        <p className="mt-1 text-sm text-slate-500">Access your Main CRM workspace.</p>
        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (!email || !password) {
              return;
            }
            router.push('/dashboard');
          }}
        >
          <div>
            <label className="text-sm font-medium text-slate-600">Email</label>
            <input
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
              placeholder="you@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              data-testid="login-email"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Password</label>
            <input
              type="password"
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              data-testid="login-password"
            />
          </div>
          <button type="submit" className="w-full rounded-md bg-slate-900 px-4 py-2 text-white" data-testid="login-submit">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
