'use client';

import * as ToastPrimitive from '@radix-ui/react-toast';
import { clsx } from 'clsx';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

type ToastVariant = 'success' | 'error' | 'info';

export type ToastItem = {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
};

type ToastContextValue = {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    setToasts((prev) => [...prev, { ...toast, id: crypto.randomUUID() }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const value = useMemo(() => ({ toasts, addToast, removeToast }), [toasts, addToast, removeToast]);

  return (
    <ToastContext.Provider value={value}>
      <ToastPrimitive.Provider duration={5000} swipeDirection="right">
        {children}
        <ToastViewport />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

export function ToastViewport() {
  return <ToastPrimitive.Viewport className="fixed right-4 top-4 z-50 flex w-80 flex-col gap-2" />;
}

export function Toast({ toast, onOpenChange }: { toast: ToastItem; onOpenChange: (open: boolean) => void }) {
  const variant = toast.variant ?? 'info';
  const variantClasses: Record<ToastVariant, string> = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    error: 'border-red-200 bg-red-50 text-red-900',
    info: 'border-slate-200 bg-white text-slate-900'
  };

  return (
    <ToastPrimitive.Root
      className={clsx(
        'relative w-full rounded-lg border p-4 shadow-lg',
        variantClasses[variant]
      )}
      onOpenChange={onOpenChange}
      open
    >
      <ToastPrimitive.Title className="text-sm font-semibold">{toast.title}</ToastPrimitive.Title>
      {toast.description ? <ToastPrimitive.Description className="text-sm text-slate-600">{toast.description}</ToastPrimitive.Description> : null}
    </ToastPrimitive.Root>
  );
}

export function ToastList() {
  const { toasts, removeToast } = useToast();
  return (
    <>
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onOpenChange={(open) => (!open ? removeToast(toast.id) : null)} />
      ))}
    </>
  );
}
