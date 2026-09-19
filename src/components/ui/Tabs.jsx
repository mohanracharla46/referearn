import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

export const Tabs = ({ tabs = [], activeTab, onChange, variant = 'underline', className = '' }) => {
  return (
    <div
      className={cn(
        variant === 'underline'
          ? 'flex gap-6 border-b border-zinc-200 overflow-x-auto'
          : 'flex p-1 bg-zinc-100 rounded-md border border-zinc-200 overflow-x-auto',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'text-xs sm:text-sm font-medium transition-subtle whitespace-nowrap flex items-center gap-2 select-none',
              variant === 'underline'
                ? isActive
                  ? 'text-zinc-950 border-b-2 border-zinc-950 py-2.5 font-semibold -mb-px'
                  : 'text-zinc-500 hover:text-zinc-900 py-2.5'
                : isActive
                ? 'bg-white text-zinc-950 shadow-xs rounded px-3 py-1.5 font-semibold'
                : 'text-zinc-600 hover:text-zinc-900 px-3 py-1.5'
            )}
          >
            {tab.icon && <tab.icon className="w-4 h-4" />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.5 rounded-full font-mono font-semibold',
                  isActive ? 'bg-zinc-900 text-white' : 'bg-zinc-200 text-zinc-700'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
