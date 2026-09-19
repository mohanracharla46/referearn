import React from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

export const Select = React.forwardRef(({
  label,
  options = [],
  error,
  helperText,
  className = '',
  containerClassName = '',
  id,
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={cn('w-full flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label htmlFor={selectId} className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        <select
          id={selectId}
          ref={ref}
          className={cn(
            'w-full appearance-none bg-white text-zinc-900 text-sm rounded-md border border-zinc-200 px-3 py-2 pr-8 transition-subtle focus:outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 disabled:bg-zinc-100 disabled:cursor-not-allowed',
            error && 'border-red-500 focus:border-red-600 focus:ring-red-600',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 w-4 h-4 text-zinc-400 pointer-events-none" />
      </div>
      {error ? (
        <p className="text-xs text-red-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-zinc-500">{helperText}</p>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';
