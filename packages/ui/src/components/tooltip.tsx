'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { clsx } from 'clsx';

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export function TooltipContent({ className, ...props }: TooltipPrimitive.TooltipContentProps) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        className={clsx('z-50 rounded-md bg-slate-900 px-3 py-1.5 text-xs text-white shadow-lg', className)}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
}
