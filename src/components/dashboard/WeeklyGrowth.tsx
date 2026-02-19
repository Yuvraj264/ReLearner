import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

interface WeeklyGrowthProps {
    growthRate: number; // e.g., 2.4 for +2.4%
    history: { value: number }[]; // 7 days of data
}

const WeeklyGrowth: React.FC<WeeklyGrowthProps> = ({ growthRate, history }) => {
    const isPositive = growthRate >= 0;
    // Use CSS variable references without 'var()' inside the gradient, but charts need explicit colors
    // So we map to HSL strings directly if possible, or assume CSS variables are set
    // Recharts needs valid CSS color strings. 

    const statusColor = isPositive ? 'var(--healthy)' : 'var(--critical)';
    const icon = isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />;

    // Normalize data for mini chart
    const data = history.map((h, i) => ({ i, value: h.value }));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 relative overflow-hidden flex flex-col justify-between min-h-[220px]"
        >
            <div className="z-10 flex justify-between items-start">
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-1">
                        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />} Weekly Growth
                    </h3>
                    <p className="text-[10px] text-muted-foreground">Net retention change</p>
                </div>
                <div className={`flex items-center gap-0.5 px-2 py-1 rounded text-xs font-bold ${isPositive ? 'bg-healthy/10 text-healthy' : 'bg-critical/10 text-critical'}`}>
                    {icon} {Math.abs(growthRate)}%
                </div>
            </div>

            <div className="flex-1 relative z-10 -mx-6 -mb-6 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="gradientGrowth" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={`hsl(${statusColor})`} stopOpacity={0.3} />
                                <stop offset="100%" stopColor={`hsl(${statusColor})`} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={`hsl(${statusColor})`}
                            strokeWidth={2}
                            fill="url(#gradientGrowth)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Decorative large number */}
            <div className="absolute top-0 right-0 p-6 pointer-events-none">
                <div className="text-4xl font-black tracking-tighter text-foreground/5">+12</div>
                <div className="text-[10px] text-right text-muted-foreground/30 uppercase">Skills improved</div>
            </div>
        </motion.div>
    );
};

export default WeeklyGrowth;
