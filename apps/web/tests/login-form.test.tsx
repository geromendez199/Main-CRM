import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from '../components/auth/login-form';
import { NextIntlClientProvider } from 'next-intl';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider, ToastList } from '@maincrm/ui';
import en from '../messages/en.json';
import { vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() })
}));

describe('LoginForm', () => {
  it('shows validation errors when fields are empty', async () => {
    const client = new QueryClient();
    render(
      <NextIntlClientProvider locale="en" messages={en}>
        <QueryClientProvider client={client}>
          <ToastProvider>
            <LoginForm />
            <ToastList />
          </ToastProvider>
        </QueryClientProvider>
      </NextIntlClientProvider>
    );

    fireEvent.click(screen.getByTestId('login-submit'));

    expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
  });
});
