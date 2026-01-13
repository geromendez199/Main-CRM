import { ReactNode } from 'react';
import { Sidebar } from '../../../components/sidebar';
import { Topbar } from '../../../components/topbar';
import { AuthGuard } from '../../../components/auth/auth-guard';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50 lg:flex">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar />
          <main className="flex-1 space-y-6 px-4 py-6 lg:px-8">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
