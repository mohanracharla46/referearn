import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-subtle rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-zinc-950 text-white hover:bg-zinc-800 active:bg-black border border-zinc-950',
    secondary: 'bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50 active:bg-zinc-100',
    outline: 'bg-transparent text-zinc-900 border border-zinc-300 hover:bg-zinc-100',
    ghost: 'bg-transparent text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 border border-red-600',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 h-8 gap-1.5',
    md: 'text-sm px-3.5 py-2 h-9 gap-2',
    lg: 'text-base px-4 py-2.5 h-11 gap-2.5',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
};
