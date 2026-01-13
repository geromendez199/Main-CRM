'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button, Input } from '@maincrm/ui';
import { useLogin } from '../../lib/use-session';
import { useToast } from '@maincrm/ui';
import { useLocale } from 'next-intl';

type LoginValues = {
  email: string;
  password: string;
};

export function LoginForm() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const login = useLogin();
  const { addToast } = useToast();
  const loginSchema = z.object({
    email: z.string().email(t('validation.email')),
    password: z.string().min(12, t('validation.password'))
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await login(values.email, values.password);
      addToast({ title: t('loginSuccess'), variant: 'success' });
      router.push(`/${locale}/app`);
    } catch (error) {
      addToast({ title: t('loginError'), variant: 'error' });
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" data-testid="login-form">
      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="email">
          {t('email')}
        </label>
        <Input id="email" type="email" placeholder={t('placeholders.email')} {...register('email')} data-testid="login-email" />
        {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email.message}</p> : null}
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="password">
          {t('password')}
        </label>
        <Input id="password" type="password" placeholder={t('placeholders.password')} {...register('password')} data-testid="login-password" />
        {errors.password ? <p className="mt-1 text-xs text-red-600">{errors.password.message}</p> : null}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting} data-testid="login-submit">
        {t('signIn')}
      </Button>
    </form>
  );
}
