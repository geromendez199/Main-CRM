import './globals.css';
import { cookies } from 'next/headers';
import { defaultLocale, locales } from '../i18n';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieLocale = cookies().get('NEXT_LOCALE')?.value;
  const locale = locales.includes(cookieLocale as (typeof locales)[number]) ? cookieLocale : defaultLocale;
  return (
    <html lang={locale}>
      <body className="bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
