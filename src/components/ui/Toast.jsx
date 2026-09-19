import React from 'react';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';
import { clsx } from 'clsx';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
    error: <XCircle className="w-4 h-4 text-rose-600 shrink-0" />,
    warning: <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />,
    info: <Info className="w-4 h-4 text-zinc-700 shrink-0" />,
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={clsx(
            'pointer-events-auto flex items-start gap-3 p-3.5 bg-white rounded-lg border border-zinc-200 shadow-md text-zinc-900 animate-in slide-in-from-bottom-2 duration-150'
          )}
        >
          {icons[toast.type]}
          <div className="flex-1">
            <h4 className="text-xs font-semibold text-zinc-900">{toast.title}</h4>
            {toast.message && (
              <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">{toast.message}</p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 text-zinc-400 hover:text-zinc-900 rounded transition-subtle"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
