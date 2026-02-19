import React, { useMemo } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts';
import { format, addDays } from 'date-fns';
import { motion } from 'framer-motion';

interface SkillDecayGraphProps {
    currentRetention: number;
    decayRate?: number; // Daily decay percentage (e.g., 1.5 for 1.5% loss per day)
    height?: number;
    className?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-card p-3 border border-primary/20 shadow-xl backdrop-blur-md bg-background/80 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">{label}</p>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    <p className="text-sm font-bold text-foreground">
                        {payload[0].value}% <span className="text-[10px] uppercase text-muted-foreground font-normal">Retention</span>
                    </p>
                </div>
                <p className="text-[10px] text-critical mt-1 font-medium">
                    -{payload[0].payload.decay.toFixed(1)}% predicted loss
                </p>
            </div>
        );
    }
    return null;
};

const SkillDecayGraph: React.FC<SkillDecayGraphProps> = ({
    currentRetention,
    decayRate = 2.5, // Default decay rate
    height = 250,
    className = '',
}) => {
    // Generate predictive data for the next 7 days
    const data = useMemo(() => {
        const today = new Date();
        const points = [];

        let currentScore = currentRetention;

        for (let i = 0; i <= 7; i++) {
            // Simple exponential decay model: N(t) = N0 * (1 - r)^t
            // Or linear for simplicity in short term: Score - (Rate * Days)
            // Let's use a slightly accelerating decay for realism
            const dayDecay = i === 0 ? 0 : decayRate * (1 + i * 0.1);
            currentScore = Math.max(0, parseFloat((currentScore - dayDecay).toFixed(1)));

            points.push({
                day: i === 0 ? 'Today' : format(addDays(today, i), 'MMM d'),
                score: currentScore,
                decay: dayDecay,
                isCritical: currentScore < 40,
                isWarning: currentScore >= 40 && currentScore < 70,
            });

            // Update base for next iteration if using compound, but here we just subtracted from previous
            // Actually, let's reset to proper recursive deduction for the loop
            // But for the graph visuals, the above linear-ish subtraction works fine for 7 days.
        }
        return points;
    }, [currentRetention, decayRate]);

    // Determine chart color based on start status
    const startColor = currentRetention >= 70
        ? 'var(--healthy)'
        : currentRetention >= 40
            ? 'var(--warning)'
            : 'var(--critical)';

    return (
        <motion.div
            className={`w-full ${className}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="h-full w-full min-h-[200px]" style={{ height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={`hsl(${startColor})`} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={`hsl(${startColor})`} stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="hsl(var(--border))"
                            opacity={0.3}
                        />

                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                            dy={10}
                        />

                        <YAxis
                            domain={[0, 100]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                        />

                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: `hsl(${startColor})`, strokeWidth: 1, strokeDasharray: '4 4' }} />

                        <ReferenceLine y={70} stroke="hsl(var(--healthy))" strokeDasharray="3 3" opacity={0.3} />
                        <ReferenceLine y={40} stroke="hsl(var(--critical))" strokeDasharray="3 3" opacity={0.3} />

                        <Area
                            type="monotone"
                            dataKey="score"
                            stroke={`hsl(${startColor})`}
                            strokeWidth={3}
                            fill="url(#colorRetention)"
                            animationDuration={2000}
                            animationEasing="ease-in-out"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default SkillDecayGraph;
