'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { ToastProvider, ToastList, TooltipProvider } from '@maincrm/ui';

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false
          }
        }
      })
  );

  return (
    <QueryClientProvider client={client}>
      <TooltipProvider>
        <ToastProvider>
          {children}
          <ToastList />
        </ToastProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
