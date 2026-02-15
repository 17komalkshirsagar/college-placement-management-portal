'use client';

import * as React from 'react';
import { FormProvider, useFormContext, type FieldValues, type UseFormReturn } from 'react-hook-form';

import { cn } from '@/lib/utils';

export function Form<TFieldValues extends FieldValues>({ children, ...props }: UseFormReturn<TFieldValues> & { children: React.ReactNode }): React.ReactElement {
  return <FormProvider {...props}>{children}</FormProvider>;
}

export function FormField({ name, children }: { name: string; children: (field: { id: string; name: string }) => React.ReactNode }): React.ReactElement {
  return <>{children({ id: name, name })}</>;
}

export function FormItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return <div className={cn('space-y-2', className)} {...props} />;
}

export function FormLabel({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>): React.ReactElement {
  return <label className={cn('text-sm font-medium', className)} {...props} />;
}

export function FormControl({ children }: { children: React.ReactNode }): React.ReactElement {
  return <>{children}</>;
}

export function FormMessage({ name }: { name: string }): React.ReactElement {
  const form = useFormContext();
  const errorMessage = (form.formState.errors[name]?.message as string | undefined) ?? '';
  return errorMessage ? <p className='text-sm text-red-600'>{errorMessage}</p> : <></>;
}

