import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  dot = false,
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-sm tracking-tight border';

  const variants = {
    default: 'bg-zinc-100 text-zinc-800 border-zinc-200',
    dark: 'bg-zinc-900 text-zinc-100 border-zinc-950',
    outline: 'bg-transparent text-zinc-700 border-zinc-300',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-rose-50 text-rose-800 border-rose-200',
    info: 'bg-zinc-100 text-zinc-900 border-zinc-300',
  };

  const dotColors = {
    default: 'bg-zinc-500',
    dark: 'bg-white',
    outline: 'bg-zinc-500',
    success: 'bg-emerald-600',
    warning: 'bg-amber-600',
    danger: 'bg-rose-600',
    info: 'bg-zinc-700',
  };

  const sizes = {
    sm: 'text-[11px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2 py-0.5 gap-1.5',
    lg: 'text-sm px-2.5 py-1 gap-1.5',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)}>
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])} />}
      {children}
    </span>
  );
};
