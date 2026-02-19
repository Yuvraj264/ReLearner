import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    Cell, ScatterChart, Scatter, ZAxis, AreaChart, Area, CartesianGrid
} from 'recharts';
import {
    TrendingUp, TrendingDown, Activity, Award, Zap,
    AlertTriangle, ShieldCheck, ArrowRight, Brain
} from 'lucide-react';
import { skillService } from '@/services/skillService';
import PageTransition from '@/components/PageTransition';

// Types
interface SkillMetric {
    name: string;
    category: string;
    score: number;
    decayRate: number;
    volatility: number;
}

const Insights = () => {
    const skills = skillService.getAllSkills().filter(s => s.learned);

    // Computed Metrics
    const stableSkills = useMemo(() => {
        return [...skills]
            .sort((a, b) => b.healthScore - a.healthScore)
            .slice(0, 5);
    }, [skills]);

    const volatileSkills = useMemo(() => {
        return [...skills]
            .sort((a, b) => (b.decayRate || 0) - (a.decayRate || 0))
            .slice(0, 3);
    }, [skills]);

    const categoryPerformance = useMemo(() => {
        const cats: Record<string, { total: number; count: number }> = {};
        skills.forEach(s => {
            if (!cats[s.category]) cats[s.category] = { total: 0, count: 0 };
            cats[s.category].total += s.healthScore;
            cats[s.category].count += 1;
        });
        return Object.entries(cats).map(([name, data]) => ({
            name,
            score: Math.round(data.total / data.count),
            count: data.count
        }));
    }, [skills]);

    // Mock Trend Data (since we don't have real historical data stored per skill yet)
    const accuracyTrend = [
        { day: 'Mon', score: 65, consistency: 80 },
        { day: 'Tue', score: 70, consistency: 85 },
        { day: 'Wed', score: 68, consistency: 75 },
        { day: 'Thu', score: 75, consistency: 90 },
        { day: 'Fri', score: 82, consistency: 95 },
        { day: 'Sat', score: 85, consistency: 88 },
        { day: 'Sun', score: 88, consistency: 92 },
    ];

    // Retention Matrix Data (Health vs. Decay Rate)
    const retentionMatrix = skills.map((s, i) => ({
        x: 100 - (s.healthScore), // Risk (Inverted Health)
        y: (s.decayRate || 0.1) * 100, // Volatility
        z: s.healthScore, // Bubble Size (Importance/Health)
        name: s.name,
        category: s.category
    }));

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <PageTransition>
            <div className="max-w-7xl mx-auto space-y-8 pb-12">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                            <Brain className="text-primary w-8 h-8" />
                            Neural Insights
                        </h1>
                        <p className="text-muted-foreground mt-1 text-lg">
                            Deep dive into your cognitive performance and skill volatility.
                        </p>
                    </div>
                    <div className="flex bg-secondary/30 p-1 rounded-lg border border-white/5">
                        {['Weekly', 'Monthly', 'All Time'].map((t, i) => (
                            <button key={t} className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${i === 0 ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-white/5'}`}>
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Top Level Metrics */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Consistency Score */}
                    <motion.div variants={itemVariants} className="glass-card p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity bg-gradient-to-bl from-primary to-transparent rounded-bl-3xl">
                            <Zap size={64} className="text-primary" />
                        </div>
                        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Zap size={16} className="text-primary" /> Consistency Score
                        </h3>
                        <div className="mt-4 flex items-baseline gap-2">
                            <span className="text-4xl font-black text-foreground">92</span>
                            <span className="text-xs font-bold text-healthy bg-healthy/10 px-2 py-0.5 rounded-full flex items-center">
                                <TrendingUp size={12} className="mr-1" /> Top 5%
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            You're forming strong neural pathways with consistent practice.
                        </p>
                    </motion.div>

                    {/* Retention Efficiency */}
                    <motion.div variants={itemVariants} className="glass-card p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity bg-gradient-to-bl from-healthy to-transparent rounded-bl-3xl">
                            <ShieldCheck size={64} className="text-healthy" />
                        </div>
                        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <ShieldCheck size={16} className="text-healthy" /> Retention Efficiency
                        </h3>
                        <div className="mt-4 flex items-baseline gap-2">
                            <span className="text-4xl font-black text-foreground">88%</span>
                            <span className="text-xs font-bold text-healthy bg-healthy/10 px-2 py-0.5 rounded-full flex items-center">
                                <TrendingUp size={12} className="mr-1" /> +4.2%
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Your average retention across all learned skills is high.
                        </p>
                    </motion.div>

                    {/* Volatility Index */}
                    <motion.div variants={itemVariants} className="glass-card p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity bg-gradient-to-bl from-warning to-transparent rounded-bl-3xl">
                            <Activity size={64} className="text-warning" />
                        </div>
                        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Activity size={16} className="text-warning" /> Volatility Index
                        </h3>
                        <div className="mt-4 flex items-baseline gap-2">
                            <span className="text-4xl font-black text-foreground">Low</span>
                            <span className="text-xs font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded-full flex items-center">
                                Stable
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Most of your skills are decaying at a predictable, slow rate.
                        </p>
                    </motion.div>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Charts */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Retention Heatmap */}
                        <motion.div
                            className="glass-card p-6 border border-white/5"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-foreground">Retention Heatmap</h3>
                                    <p className="text-xs text-muted-foreground">Risk vs. Volatility Analysis</p>
                                </div>
                                <div className="flex gap-2 text-[10px]">
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-healthy" /> Stable</span>
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-critical" /> Critical</span>
                                </div>
                            </div>

                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                        <XAxis type="number" dataKey="x" name="Risk Score" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis type="number" dataKey="y" name="Volatility" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                        <ZAxis type="number" dataKey="z" range={[100, 800]} name="Health" />
                                        <Tooltip
                                            cursor={{ strokeDasharray: '3 3' }}
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const data = payload[0].payload;
                                                    return (
                                                        <div className="glass-card p-3 border border-border bg-background/90 backdrop-blur-md rounded-lg shadow-xl text-xs">
                                                            <p className="font-bold mb-1 text-primary">{data.name}</p>
                                                            <p className="text-muted-foreground">{data.category}</p>
                                                            <div className="mt-2 flex gap-3">
                                                                <span>Health: <span className="text-foreground font-mono">{data.z}%</span></span>
                                                                <span>Risk: <span className="text-foreground font-mono">{Math.round(data.x)}</span></span>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Scatter name="Skills" data={retentionMatrix} fill="#8884d8">
                                            {retentionMatrix.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.z > 70 ? 'var(--healthy)' : entry.z < 40 ? 'var(--critical)' : 'var(--warning)'} />
                                            ))}
                                        </Scatter>
                                    </ScatterChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Weekly Performance */}
                        <motion.div
                            className="glass-card p-6 border border-white/5"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-foreground">Performance Trend</h3>
                                    <p className="text-xs text-muted-foreground">Weekly consistency vs. average score</p>
                                </div>
                            </div>
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={accuracyTrend}>
                                        <defs>
                                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorConsistency" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(var(--secondary-foreground))" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="hsl(var(--secondary-foreground))" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} dy={10} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorScore)" strokeWidth={3} />
                                        <Area type="monotone" dataKey="consistency" stroke="hsl(var(--secondary-foreground))" fillOpacity={1} fill="url(#colorConsistency)" strokeWidth={3} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                    </div>

                    {/* Right Column: Leaderboard & Stats */}
                    <div className="space-y-6">

                        {/* Top Stable Skills */}
                        <motion.div
                            className="glass-card p-6 border border-white/5"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                <Award className="text-yellow-500" size={20} />
                                Top Stable Skills
                            </h3>
                            <div className="space-y-4">
                                {stableSkills.map((skill, i) => (
                                    <div key={skill.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-background flex items-center justify-center font-bold text-sm text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all duration-300 border border-white/10">
                                            {i + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-foreground truncate">{skill.name}</h4>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <div className="flex-1 h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                                                    <div className="h-full bg-healthy rounded-full" style={{ width: `${skill.healthScore}%` }} />
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-sm font-bold text-healthy tabular-nums">{skill.healthScore}%</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Most Volatile Skills */}
                        <motion.div
                            className="glass-card p-6 border border-white/5 relative overflow-hidden"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-critical to-transparent opacity-50" />

                            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                <TrendingDown className="text-critical" size={20} />
                                High Volatility
                            </h3>
                            <p className="text-xs text-muted-foreground mb-4">Skills requiring frequent reinforcement</p>

                            <div className="space-y-3">
                                {volatileSkills.map((skill) => (
                                    <div key={skill.id} className="p-3 rounded-lg border border-critical/20 bg-critical/5">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-sm font-medium text-foreground">{skill.name}</h4>
                                            <span className="text-[10px] uppercase font-bold text-critical bg-critical/10 px-1.5 py-0.5 rounded">
                                                -{(skill.decayRate || 0.1) * 100}% / day
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                                            <span>Health: <span className="text-foreground">{skill.healthScore}%</span></span>
                                            <button className="text-primary hover:underline flex items-center gap-1">
                                                Review <ArrowRight size={10} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Category Breakdown (Mini) */}
                        <motion.div
                            className="glass-card p-6"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Category Performance</h3>
                            <div className="space-y-4">
                                {categoryPerformance.map((cat) => (
                                    <div key={cat.name} className="flex items-center justify-between text-sm">
                                        <span className="text-foreground/80">{cat.name}</span>
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 h-2 bg-secondary/50 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary rounded-full" style={{ width: `${cat.score}%` }} />
                                            </div>
                                            <span className="font-mono text-xs w-8 text-right">{cat.score}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                    </div>
                </div>

            </div>
        </PageTransition>
    );
};

export default Insights;
