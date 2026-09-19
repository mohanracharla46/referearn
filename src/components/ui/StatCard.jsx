import React from 'react';
import { TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';
import { Card } from './Card';
import { Tooltip } from './Tooltip';
import { formatCurrency, formatNumber } from '../../utils/formatters';

export const StatCard = ({
  title,
  value,
  isCurrency = true,
  change,
  period = 'vs last month',
  icon: Icon,
  tooltip,
  subtitle,
}) => {
  const isPositive = change > 0;
  const isNegative = change < 0;

  const displayValue = isCurrency ? formatCurrency(value) : formatNumber(value);

  return (
    <Card className="hover:border-zinc-300 transition-subtle">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{title}</span>
          {tooltip && (
            <Tooltip content={tooltip}>
              <HelpCircle className="w-3.5 h-3.5 text-zinc-400 cursor-help" />
            </Tooltip>
          )}
        </div>
        {Icon && (
          <div className="p-2 rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-1">
        <div className="financial-num text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
          {displayValue}
        </div>

        {(change !== undefined || subtitle) && (
          <div className="flex items-center gap-2 mt-2">
            {change !== undefined && (
              <span
                className={`inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded border ${
                  isPositive
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : isNegative
                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                    : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-3 h-3 text-emerald-600" />
                ) : isNegative ? (
                  <TrendingDown className="w-3 h-3 text-rose-600" />
                ) : null}
                {isPositive ? `+${change}%` : `${change}%`}
              </span>
            )}
            <span className="text-xs text-zinc-500">{subtitle || period}</span>
          </div>
        )}
      </div>
    </Card>
  );
};
