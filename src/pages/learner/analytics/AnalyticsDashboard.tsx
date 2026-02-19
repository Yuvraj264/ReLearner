import React from 'react';
import { motion } from 'framer-motion';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Area,
    AreaChart,
    ScatterChart,
    Scatter,
    ZAxis,
    Cell
} from 'recharts';
import {
    Activity,
    TrendingUp,
    Target,
    Clock,
    Calendar,
    Layers,
    Zap,
    Brain
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';

// Mock Data
const weeklyRetentionData = [
    { week: 'W1', retention: 65, accuracy: 60 },
    { week: 'W2', retention: 68, accuracy: 65 },
    { week: 'W3', retention: 72, accuracy: 70 },
    { week: 'W4', retention: 70, accuracy: 72 },
    { week: 'W5', retention: 75, accuracy: 78 },
    { week: 'W6', retention: 82, accuracy: 85 },
    { week: 'W7', retention: 88, accuracy: 89 },
];

const skillStabilityData = [
    { category: 'Frontend', stability: 92, decayRisk: 15 },
    { category: 'Backend', stability: 85, decayRisk: 25 },
    { category: 'DevOps', stability: 78, decayRisk: 35 },
    { category: 'Design', stability: 88, decayRisk: 10 },
    { category: 'Soft Skills', stability: 95, decayRisk: 5 },
];

// Heatmap-like data using Scatter chart
const riskMatrixData = [
    { x: 1, y: 1, z: 100, name: 'Low Risk', color: 'var(--healthy)' },
    { x: 2, y: 1, z: 200, name: 'Moderate Risk', color: 'var(--warning)' },
    { x: 3, y: 1, z: 50, name: 'High Risk', color: 'var(--critical)' },
    { x: 1, y: 2, z: 150, name: 'Stable', color: 'var(--healthy)' },
    { x: 2, y: 2, z: 80, name: 'Improving', color: 'var(--primary)' },
    { x: 3, y: 2, z: 120, name: 'Declining', color: 'var(--warning)' },
];

const MetricCard = ({ title, value, subtext, icon: Icon, trend, color }: any) => (
    <motion.div
        className="glass-card p-5 relative overflow-hidden group"
        whileHover={{ y: -5 }}
    >
        <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
            <Icon size={80} />
        </div>

        <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
                <div className={`p-2 rounded-lg bg-background/50 ${color}`}>
                    <Icon size={18} />
                </div>
            </div>

            <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold tracking-tight text-foreground">{value}</span>
                {trend && (
                    <span className="text-xs font-medium text-healthy flex items-center">
                        <TrendingUp size={12} className="mr-0.5" /> {trend}
                    </span>
                )}
            </div>

            <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
        </div>

        {/* Animated glow bar at bottom */}
        <motion.div
            className={`absolute bottom-0 left-0 h-1 ${color.replace('text-', 'bg-')}`}
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, ease: "circOut" }}
        />
    </motion.div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-card p-3 border border-border shadow-xl backdrop-blur-md bg-background/90 rounded-lg text-xs">
                <p className="font-bold mb-1">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 mb-0.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-muted-foreground">{entry.name}:</span>
                        <span className="font-mono font-medium">{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const AnalyticsDashboard = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <PageTransition>
            <div className="max-w-7xl mx-auto space-y-6 pb-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            <Activity className="text-primary" />
                            Retention Analytics
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Deep dive into your learning patterns and skill health.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 bg-secondary/30 p-1 rounded-lg border border-white/5">
                        {['7 Days', '30 Days', '3 Months', 'Year'].map((range, i) => (
                            <button
                                key={range}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${i === 1 ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Metrics Row */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <MetricCard
                        title="Retention Half-Life"
                        value="14.2 Days"
                        subtext="Time until 50% knowledge decay"
                        icon={Clock}
                        trend="+2.5 days"
                        color="text-primary"
                    />
                    <MetricCard
                        title="Consistency Score"
                        value="94"
                        subtext="Based on daily recall sessions"
                        icon={Zap}
                        trend="+5 pts"
                        color="text-warning"
                    />
                    <MetricCard
                        title="Avg. Accuracy"
                        value="88%"
                        subtext="Correct answers ratio"
                        icon={Target}
                        trend="+3%"
                        color="text-healthy"
                    />
                    <MetricCard
                        title="Skills Mastered"
                        value="12"
                        subtext="Total skills > 90% retention"
                        icon={Brain}
                        color="text-purple-400"
                    />
                </motion.div>

                {/* Main Chart Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Line Chart: Retention Trend */}
                    <motion.div
                        className="lg:col-span-2 glass-card p-6"
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-foreground">Retention Velocity</h3>
                                <p className="text-xs text-muted-foreground">Improvement in average retention score over time</p>
                            </div>
                            <TrendingUp className="text-healthy/50" />
                        </div>

                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={weeklyRetentionData}>
                                    <defs>
                                        <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--healthy))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--healthy))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
                                    <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} domain={[0, 100]} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Area
                                        type="monotone"
                                        dataKey="retention"
                                        name="Retention Score"
                                        stroke="hsl(var(--primary))"
                                        fillOpacity={1}
                                        fill="url(#colorRetention)"
                                        strokeWidth={3}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="accuracy"
                                        name="Recall Accuracy"
                                        stroke="hsl(var(--healthy))"
                                        fillOpacity={1}
                                        fill="url(#colorAccuracy)"
                                        strokeWidth={3}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Bar Chart: Skill Stability */}
                    <motion.div
                        className="glass-card p-6"
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-foreground">Category Stability</h3>
                                <p className="text-xs text-muted-foreground">Average stability score by category</p>
                            </div>
                            <Layers className="text-primary/50" />
                        </div>

                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={skillStabilityData} layout="vertical" barSize={20}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" opacity={0.3} />
                                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} domain={[0, 100]} />
                                    <YAxis type="category" dataKey="category" width={80} axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="stability" name="Stability" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                                    <Bar dataKey="decayRisk" name="Decay Risk" fill="hsl(var(--warning))" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                </div>

                {/* Heatmap Section */}
                <motion.div
                    className="glass-card p-6"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-foreground">Decay Risk Matrix</h3>
                            <p className="text-xs text-muted-foreground">Visualizing skill clusters by risk and importance</p>
                        </div>
                        <Activity className="text-critical/50" />
                    </div>

                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                                <XAxis type="number" dataKey="x" name="Importance" unit="" tick={false} axisLine={false} />
                                <YAxis type="number" dataKey="y" name="Decay Rate" unit="" tick={false} axisLine={false} />
                                <ZAxis type="number" dataKey="z" range={[100, 500]} name="Skill Count" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                                <Scatter name="Skills" data={riskMatrixData} fill="#8884d8">
                                    {riskMatrixData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-healthy"></div> Low Risk</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-warning"></div> Moderate Risk</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-critical"></div> High Risk</span>
                    </div>
                </motion.div>

            </div>
        </PageTransition>
    );
};

export default AnalyticsDashboard;
