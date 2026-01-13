import './globals.css';
import type { Metadata } from 'next';
import { Providers } from './providers';
import { Sidebar } from '../components/sidebar';
import { Topbar } from '../components/topbar';

export const metadata: Metadata = {
  title: 'Main CRM',
  description: 'Enterprise CRM platform'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen flex">
            <Sidebar />
            <div className="flex-1">
              <Topbar />
              <main className="p-6">{children}</main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
