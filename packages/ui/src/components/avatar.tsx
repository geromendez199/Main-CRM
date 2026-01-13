'use client';

import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { clsx } from 'clsx';

export const Avatar = AvatarPrimitive.Root;

export function AvatarImage({ className, ...props }: AvatarPrimitive.AvatarImageProps) {
  return <AvatarPrimitive.Image className={clsx('h-full w-full rounded-full object-cover', className)} {...props} />;
}

export function AvatarFallback({ className, ...props }: AvatarPrimitive.AvatarFallbackProps) {
  return (
    <AvatarPrimitive.Fallback
      className={clsx(
        'flex h-full w-full items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600',
        className
      )}
      {...props}
    />
  );
}
