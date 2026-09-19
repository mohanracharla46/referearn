import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

export const Card = ({ children, className = '', header, footer, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white border border-zinc-200 rounded-lg overflow-hidden transition-subtle',
        className
      )}
      {...props}
    >
      {header && (
        <div className="p-4 sm:p-5 border-b border-zinc-200 bg-zinc-50/50 flex items-center justify-between">
          {header}
        </div>
      )}
      <div className="p-4 sm:p-5">{children}</div>
      {footer && (
        <div className="p-3 sm:p-4 border-t border-zinc-200 bg-zinc-50/50">
          {footer}
        </div>
      )}
    </div>
  );
};
