import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={cn('animate-pulse bg-zinc-200/80 rounded-md', className)}
      {...props}
    />
  );
};

export const CardSkeleton = () => (
  <div className="p-5 bg-white border border-zinc-200 rounded-lg space-y-3">
    <Skeleton className="h-4 w-1/3" />
    <Skeleton className="h-8 w-2/3" />
    <Skeleton className="h-3 w-1/2" />
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="w-full border border-zinc-200 rounded-lg bg-white overflow-hidden p-4 space-y-3">
    <div className="flex gap-4 border-b border-zinc-200 pb-3">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-4 w-1/4" />
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 py-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    ))}
  </div>
);
