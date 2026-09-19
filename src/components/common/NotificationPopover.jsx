import React, { useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const NotificationPopover = ({ notifications = [], onMarkRead }) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-md transition-subtle"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-600 ring-2 ring-white" />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg border border-zinc-200 shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            <div className="p-3.5 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-900">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 font-bold rounded bg-zinc-950 text-white font-mono">
                    {unreadCount} NEW
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={onMarkRead}
                  className="text-xs text-zinc-600 hover:text-zinc-950 flex items-center gap-1 font-medium"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-zinc-100">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-500">No new notifications</div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3.5 text-xs transition-subtle ${
                      !notif.read ? 'bg-zinc-50/80 font-medium' : 'bg-white text-zinc-600'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-semibold text-zinc-900">{notif.title}</span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {formatDate(notif.date, true)}
                      </span>
                    </div>
                    <p className="text-zinc-600 text-[11px] leading-normal">{notif.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
