import React from 'react';
import { FolderOpen } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = FolderOpen,
  title = 'No data found',
  description = 'There are no items matching your criteria at this moment.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white border border-zinc-200 rounded-lg ${className}`}>
      <div className="w-12 h-12 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mb-3">
        <Icon className="w-6 h-6 text-zinc-500" />
      </div>
      <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
      <p className="text-xs sm:text-sm text-zinc-500 max-w-sm mt-1 mb-5 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
