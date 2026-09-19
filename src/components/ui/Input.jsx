import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

export const Input = React.forwardRef(({
  label,
  error,
  helperText,
  prefix,
  suffix,
  icon: Icon,
  className = '',
  containerClassName = '',
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={cn('w-full flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        {prefix && (
          <span className="absolute left-3 text-sm font-medium text-zinc-500 pointer-events-none select-none">
            {prefix}
          </span>
        )}
        {Icon && !prefix && (
          <Icon className="absolute left-3 w-4 h-4 text-zinc-400 pointer-events-none" />
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'w-full bg-white text-zinc-900 text-sm rounded-md border border-zinc-200 px-3 py-2 transition-subtle placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 disabled:bg-zinc-100 disabled:text-zinc-500 disabled:cursor-not-allowed',
            (prefix || Icon) && 'pl-9',
            suffix && 'pr-9',
            error && 'border-red-500 focus:border-red-600 focus:ring-red-600',
            className
          )}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3 text-xs font-mono text-zinc-400 pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {error ? (
        <p className="text-xs text-red-600 font-medium mt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-zinc-500 mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
