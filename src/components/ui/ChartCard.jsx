import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid } from 'recharts';
import { Card } from './Card';
import { Button } from './Button';
import { formatCurrency } from '../../utils/formatters';

export const ChartCard = ({
  title,
  subtitle,
  data = [],
  dataKey = 'earnings',
  xAxisKey = 'day',
  isCurrency = true,
}) => {
  const [timeframe, setTimeframe] = useState('7d');

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const val = payload[0].value;
      return (
        <div className="bg-zinc-950 text-white p-2.5 rounded-md border border-zinc-800 shadow-md text-xs">
          <p className="font-semibold text-zinc-300">{label}</p>
          <p className="financial-num text-sm font-bold text-white mt-1">
            {isCurrency ? formatCurrency(val) : val}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card
      header={
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
            {subtitle && <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-md border border-zinc-200">
            {['7d', '30d', '90d'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`text-xs px-2.5 py-1 rounded font-medium transition-subtle ${
                  timeframe === tf
                    ? 'bg-zinc-950 text-white shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {tf.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      }
    >
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
            <XAxis
              dataKey={xAxisKey}
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#e4e4e7' }}
            />
            <YAxis
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => (isCurrency ? `₹${val}` : val)}
            />
            <RechartsTooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke="#09090b"
              strokeWidth={2}
              fill="#f4f4f5"
              activeDot={{ r: 5, fill: '#09090b', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
