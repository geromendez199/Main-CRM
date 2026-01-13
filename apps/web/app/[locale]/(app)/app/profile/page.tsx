'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Badge, Button, Input, Skeleton } from '@maincrm/ui';
import { useSession } from '../../../../lib/use-session';
import { useTenant, useUpdateUser } from '../../../../lib/queries';
import { useToast } from '@maincrm/ui';

const profileSchema = z.object({
  name: z.string().min(2)
});

const passwordSchema = z.object({
  password: z.string().min(12)
});

type ProfileValues = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const t = useTranslations('profile');
  const tActions = useTranslations('app.actions');
  const { data: session } = useSession();
  const tenantQuery = useTenant();
  const { addToast } = useToast();

  const updateUser = useUpdateUser(session?.user.id ?? '');

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user.email.split('@')[0] ?? ''
    }
  });

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema)
  });

  const handleProfileSubmit = profileForm.handleSubmit(async (values) => {
    try {
      await updateUser.mutateAsync({ name: values.name });
      addToast({ title: t('updateSuccess'), variant: 'success' });
    } catch {
      addToast({ title: t('updateError'), variant: 'error' });
    }
  });

  const handlePasswordSubmit = passwordForm.handleSubmit(async (values) => {
    try {
      await updateUser.mutateAsync({ password: values.password });
      addToast({ title: t('updateSuccess'), variant: 'success' });
    } catch {
      addToast({ title: t('updateError'), variant: 'error' });
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{t('title')}</h1>
        <p className="text-sm text-slate-500">{t('subtitle')}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">{t('details')}</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div>
              <p className="text-xs uppercase text-slate-400">{t('emailLabel')}</p>
              <p>{session?.user.email ?? '-'}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-400">{t('roleLabel')}</p>
              <Badge>{session?.user.role ?? '-'}</Badge>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-400">{t('tenantLabel')}</p>
              {tenantQuery.isLoading ? <Skeleton className="h-4 w-24" /> : <p>{tenantQuery.data?.data.name ?? '-'}</p>}
            </div>
            <div>
              <p className="text-xs uppercase text-slate-400">{t('teamLabel')}</p>
              <p>{session?.user.teamId ?? '-'}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-400">{t('avatarTitle')}</p>
              <p className="text-sm text-slate-500">{t('avatarDescription')}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-900">{t('details')}</h2>
          <form className="mt-4 space-y-4" onSubmit={handleProfileSubmit}>
            <div>
              <label className="text-sm font-medium text-slate-700" htmlFor="name">
                {t('nameLabel')}
              </label>
              <Input id="name" {...profileForm.register('name')} />
              {profileForm.formState.errors.name ? (
                <p className="mt-1 text-xs text-red-600">{profileForm.formState.errors.name.message}</p>
              ) : null}
            </div>
            <Button type="submit" disabled={!session?.user}>{tActions('save')}</Button>
          </form>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">{t('security')}</h2>
        <form className="mt-4 space-y-4" onSubmit={handlePasswordSubmit}>
          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="password">
              {t('newPassword')}
            </label>
            <Input id="password" type="password" {...passwordForm.register('password')} />
            {passwordForm.formState.errors.password ? (
              <p className="mt-1 text-xs text-red-600">{passwordForm.formState.errors.password.message}</p>
            ) : null}
          </div>
          <Button type="submit" disabled={!session?.user}>{t('changePassword')}</Button>
        </form>
      </div>
    </div>
  );
}
