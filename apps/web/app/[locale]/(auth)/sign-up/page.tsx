import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { AppLocale } from '../../../../i18n';
import { SignUpForm } from '../../../../components/auth/signup-form';

export default function SignUpPage({ params }: { params: { locale: AppLocale } }) {
  const t = useTranslations('auth');

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{t('signUp')}</h1>
          <p className="mt-2 text-sm text-slate-500">{t('signupSubtitle')}</p>
        </div>
        <SignUpForm />
        <p className="text-sm text-slate-500">
          {t('haveAccount')}{' '}
          <Link className="text-slate-900 underline" href={`/${params.locale}/login`}>
            {t('signIn')}
          </Link>
        </p>
      </div>
    </div>
  );
}
