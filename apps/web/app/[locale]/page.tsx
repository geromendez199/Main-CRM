import { redirect } from 'next/navigation';
import type { AppLocale } from '../../i18n';

export default function LocaleIndexPage({ params }: { params: { locale: AppLocale } }) {
  redirect(`/${params.locale}/login`);
}
