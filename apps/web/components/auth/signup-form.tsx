'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { z } from 'zod';
import { Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Badge } from '@maincrm/ui';
import { useCreateUser, useRoles } from '../../lib/queries';
import { useToast } from '@maincrm/ui';
import { useSession } from '../../lib/use-session';

type SignUpValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  roleId: string;
};

export function SignUpForm() {
  const t = useTranslations('auth');
  const { addToast } = useToast();
  const { data: session } = useSession();
  const rolesQuery = useRoles();
  const createUser = useCreateUser();

  const signUpSchema = z
    .object({
      name: z.string().min(2, t('validation.name')),
      email: z.string().email(t('validation.email')),
      password: z.string().min(12, t('validation.password')),
      confirmPassword: z.string().min(12, t('validation.password')),
      roleId: z.string().min(1, t('validation.role'))
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('passwordMismatch'),
      path: ['confirmPassword']
    });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema)
  });

  const roles = rolesQuery.data?.data.items ?? [];

  useEffect(() => {
    if (roles[0]) {
      setValue('roleId', roles[0].id);
    }
  }, [roles, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createUser.mutateAsync({
        name: values.name,
        email: values.email,
        password: values.password,
        roleId: values.roleId
      });
      addToast({ title: t('signupSuccess'), variant: 'success' });
    } catch (error) {
      addToast({ title: t('signupError'), variant: 'error' });
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {!session?.user ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
          <Badge className="border-amber-200 bg-amber-100 text-amber-700">{t('adminNoticeTitle')}</Badge>
          <p className="mt-2">{t('adminNoticeBody')}</p>
        </div>
      ) : null}
      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="name">
          {t('name')}
        </label>
        <Input id="name" placeholder={t('placeholders.name')} {...register('name')} />
        {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name.message}</p> : null}
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="email">
          {t('email')}
        </label>
        <Input id="email" type="email" placeholder={t('placeholders.signupEmail')} {...register('email')} />
        {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email.message}</p> : null}
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="role">
          {t('roleLabel')}
        </label>
        <Select
          onValueChange={(value) => setValue('roleId', value)}
          defaultValue={roles[0]?.id}
        >
          <SelectTrigger id="role" aria-label={t('roleLabel')}>
            <SelectValue placeholder={t('rolePlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role.id} value={role.id}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.roleId ? <p className="mt-1 text-xs text-red-600">{errors.roleId.message}</p> : null}
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="password">
          {t('password')}
        </label>
        <Input id="password" type="password" placeholder={t('placeholders.password')} {...register('password')} />
        {errors.password ? <p className="mt-1 text-xs text-red-600">{errors.password.message}</p> : null}
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="confirmPassword">
          {t('confirmPassword')}
        </label>
        <Input id="confirmPassword" type="password" placeholder={t('placeholders.confirmPassword')} {...register('confirmPassword')} />
        {errors.confirmPassword ? <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p> : null}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting || !session?.user}>
        {t('signUp')}
      </Button>
    </form>
  );
}
