import React, { useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    ComposedChart
} from 'recharts';

interface SkillDecayGraphProps {
    currentScore: number;
    decayRate?: number;
    daysToProject?: number;
    height?: number;
    showAxes?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-background/90 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-xl">
                <p className="text-xs text-muted-foreground font-mono mb-1">{label}</p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]"></div>
                    <span className="text-sm font-bold text-foreground">
                        {data.score}% Retention
                    </span>
                </div>
                {data.loss > 0 && (
                    <p className="text-[10px] text-critical mt-1 text-right">
                        -{data.loss}% loss
                    </p>
                )}
            </div>
        );
    }
    return null;
};

const SkillDecayGraph = ({
    currentScore,
    decayRate = 0.1,
    daysToProject = 7,
    height = 200,
    showAxes = true
}: SkillDecayGraphProps) => {

    const data = useMemo(() => {
        const points = [];
        const today = new Date();

        for (let i = 0; i <= daysToProject; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            // Decay Formula: P = S * e^(-r * t)
            const predicted = Math.max(0, currentScore * Math.exp(-decayRate * i));
            const roundedScore = Math.round(predicted * 10) / 10;

            points.push({
                day: i === 0 ? 'Today' : `Day ${i}`,
                fullDate: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                score: roundedScore,
                loss: Math.round((currentScore - roundedScore) * 10) / 10
            });
        }
        return points;
    }, [currentScore, decayRate, daysToProject]);

    return (
        <div className="w-full h-full min-h-[100px]" style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="neonGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                        <filter id="neonGlow" height="130%">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
                            <feOffset in="blur" dx="0" dy="0" result="offsetBlur" />
                            <feFlood floodColor="hsl(var(--primary))" floodOpacity="0.6" result="glowColor" />
                            <feComposite in="glowColor" in2="offsetBlur" operator="in" result="glow" />
                            <feMerge>
                                <feMergeNode in="glow" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {showAxes && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />}

                    <XAxis
                        dataKey="day"
                        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        hide={!showAxes}
                    />

                    <YAxis
                        domain={[0, 100]}
                        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        hide={!showAxes}
                    />

                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />

                    <Area
                        type="monotone"
                        dataKey="score"
                        stroke="none"
                        fill="url(#neonGradient)"
                        animationDuration={1500}
                    />

                    <Line
                        type="monotone"
                        dataKey="score"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={{ r: 3, fill: "hsl(var(--primary))", strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: "hsl(var(--background))", stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                        filter="url(#neonGlow)"
                        animationDuration={1500}
                        animationEasing="ease-out"
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SkillDecayGraph;
