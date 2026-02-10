import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface RecallBarChartProps {
  data: { week: string; completed: number; missed: number }[];
  height?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 text-xs border border-glass-border">
        <p className="text-muted-foreground mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} style={{ color: p.color }} className="font-medium">
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const RecallBarChart = ({ data, height = 250 }: RecallBarChartProps) => (
  <ResponsiveContainer width="100%" height={height}>
    <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 16%, 16%)" vertical={false} />
      <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'hsl(215, 15%, 52%)' }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fontSize: 11, fill: 'hsl(215, 15%, 52%)' }} axisLine={false} tickLine={false} />
      <Tooltip content={<CustomTooltip />} />
      <Legend wrapperStyle={{ fontSize: 11, color: 'hsl(215, 15%, 52%)' }} />
      <Bar dataKey="completed" name="Completed" fill="hsl(192, 85%, 48%)" radius={[4, 4, 0, 0]} />
      <Bar dataKey="missed" name="Missed" fill="hsl(0, 68%, 52%)" radius={[4, 4, 0, 0]} opacity={0.7} />
    </BarChart>
  </ResponsiveContainer>
);

export default RecallBarChart;
