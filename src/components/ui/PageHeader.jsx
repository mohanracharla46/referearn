import React from 'react';

export const PageHeader = ({ title, subtitle, breadcrumbs = [], actions }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-zinc-200">
      <div>
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1 font-medium">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span>/</span>}
                <span className={idx === breadcrumbs.length - 1 ? 'text-zinc-900 font-semibold' : ''}>
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950">{title}</h1>
        {subtitle && <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">{subtitle}</p>}
      </div>

      {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
    </div>
  );
};
