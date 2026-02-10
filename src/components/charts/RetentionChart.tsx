import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RetentionChartProps {
  data: { date: string; score: number }[];
  height?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 text-xs border border-glass-border">
        <p className="text-muted-foreground">{label}</p>
        <p className="text-foreground font-semibold">{payload[0].value}% retention</p>
      </div>
    );
  }
  return null;
};

const RetentionChart = ({ data, height = 200 }: RetentionChartProps) => (
  <ResponsiveContainer width="100%" height={height}>
    <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
      <defs>
        <linearGradient id="retentionGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="hsl(192, 85%, 48%)" stopOpacity={0.3} />
          <stop offset="95%" stopColor="hsl(192, 85%, 48%)" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 16%, 16%)" vertical={false} />
      <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(215, 15%, 52%)' }} axisLine={false} tickLine={false} />
      <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'hsl(215, 15%, 52%)' }} axisLine={false} tickLine={false} />
      <Tooltip content={<CustomTooltip />} />
      <Area type="monotone" dataKey="score" stroke="hsl(192, 85%, 48%)" strokeWidth={2} fill="url(#retentionGradient)" />
    </AreaChart>
  </ResponsiveContainer>
);

export default RetentionChart;
