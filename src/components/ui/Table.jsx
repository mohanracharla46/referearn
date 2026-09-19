import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

export const Table = ({ headers = [], children, className = '', containerClassName = '' }) => {
  return (
    <div className={cn('w-full overflow-x-auto border border-zinc-200 rounded-lg bg-white shadow-2xs', containerClassName)}>
      <table className={cn('w-full text-left text-xs sm:text-sm text-zinc-900 border-collapse min-w-[640px] sm:min-w-full', className)}>
        {headers.length > 0 && (
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/90 text-[11px] font-bold text-zinc-600 uppercase tracking-wider font-mono">
              {headers.map((head, idx) => (
                <th key={idx} className="px-3.5 py-3 select-none whitespace-nowrap">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-zinc-200/80">{children}</tbody>
      </table>
    </div>
  );
};

export const TableRow = ({ children, className = '', onClick }) => {
  return (
    <tr
      onClick={onClick}
      className={cn(
        'hover:bg-zinc-50/80 transition-subtle',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </tr>
  );
};

export const TableCell = ({ children, className = '', align = 'left' }) => {
  const alignments = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <td className={cn('px-3.5 py-3 whitespace-nowrap text-xs sm:text-sm text-zinc-800 font-medium', alignments[align], className)}>
      {children}
    </td>
  );
};
