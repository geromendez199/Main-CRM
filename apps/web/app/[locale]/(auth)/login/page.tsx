import Link from 'next/link';
import { LoginForm } from '../../../../components/auth/login-form';
import { useTranslations } from 'next-intl';
import type { AppLocale } from '../../../../i18n';

export default function LoginPage({ params }: { params: { locale: AppLocale } }) {
  const t = useTranslations('auth');

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{t('welcome')}</h1>
          <p className="mt-2 text-sm text-slate-500">{t('subtitle')}</p>
        </div>
        <LoginForm />
        <p className="text-sm text-slate-500">
          {t('cta')}{' '}
          <Link className="text-slate-900 underline" href={`/${params.locale}/sign-up`}>
            {t('signUp')}
          </Link>
        </p>
      </div>
    </div>
  );
}
