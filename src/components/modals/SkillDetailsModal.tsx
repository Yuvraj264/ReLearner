import React, { useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Activity, Calendar, Award, Target, BrainCircuit, RefreshCw } from 'lucide-react';
import SkillDecayGraph from '@/components/charts/SkillDecayGraph';
import { getSkillHealth } from '@/constants/skillLevels';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface SkillDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    skill: {
        _id?: string;
        id?: string;
        name?: string;
        title?: string;
        category?: string;
        healthScore?: number;
        decayRate?: number;
        retention?: {
            health?: number;
            decayRate?: number;
        };
    } | null;
}

const mockAccuracyData = [
    { date: 'Mon', accuracy: 85 },
    { date: 'Tue', accuracy: 88 },
    { date: 'Wed', accuracy: 82 },
    { date: 'Thu', accuracy: 91 },
    { date: 'Fri', accuracy: 89 },
    { date: 'Sat', accuracy: 94 },
    { date: 'Sun', accuracy: 96 },
];

const mockRecallHistory = [
    { id: 1, date: '2 days ago', score: 96, type: 'Spaced Repetition' },
    { id: 2, date: '5 days ago', score: 89, type: 'Quiz' },
    { id: 3, date: '1 week ago', score: 82, type: 'Initial Learning' },
];

const mockWeakConcepts = ['React Hooks', 'Context API', 'State Management'];

const SkillDetailsModal = ({ isOpen, onClose, skill }: SkillDetailsModalProps) => {
    const navigate = useNavigate();

    if (!skill) return null;

    const healthScore = skill.retention?.health ?? skill.healthScore ?? 0;
    const health = getSkillHealth(healthScore);
    const decayRate = skill.retention?.decayRate ?? skill.decayRate ?? 0.1;

    const healthColor = health === 'healthy' ? 'text-healthy bg-healthy/10 border-healthy/20' :
        health === 'at_risk' ? 'text-warning bg-warning/10 border-warning/20' :
            'text-critical bg-critical/10 border-critical/20';

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-3xl bg-background/95 backdrop-blur-xl border-white/10 p-0 overflow-hidden text-foreground">

                {/* Header Section */}
                <div className="p-6 border-b border-white/5 relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-full h-1 ${health === 'healthy' ? 'bg-healthy' : health === 'at_risk' ? 'bg-warning' : 'bg-critical'
                        }`} />
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-widest bg-white/5 border border-white/10 text-muted-foreground/80">
                                    {skill.category}
                                </span>
                                <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-widest border ${healthColor}`}>
                                    {health.replace('_', ' ')}: {healthScore}%
                                </span>
                            </div>
                            <DialogTitle className="text-2xl font-bold tracking-tight">{skill.name || skill.title}</DialogTitle>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    onClose();
                                    navigate(`/learner/recall/${skill._id || skill.id}`);
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold text-sm rounded-lg hover:bg-primary/90 transition-colors shadow-[0_0_15px_hsl(var(--primary)/0.3)]"
                            >
                                <RefreshCw size={16} /> Start Review
                            </button>
                        </div>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto px-6 py-4 space-y-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">

                    {/* Decay Projection Graph */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-semibold">30-Day Retention Projection</h3>
                        </div>
                        <div className="p-4 rounded-xl bg-card/40 border border-white/5 h-[250px] relative">
                            <SkillDecayGraph
                                currentScore={healthScore}
                                decayRate={decayRate}
                                daysToProject={30}
                                height={220}
                                showAxes={true}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Accuracy Trend */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Target className="w-5 h-5 text-primary" />
                                <h3 className="text-lg font-semibold">Accuracy Trend</h3>
                            </div>
                            <div className="p-4 rounded-xl bg-card/40 border border-white/5 h-[220px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={mockAccuracyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                        <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} />
                                        <YAxis domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                            itemStyle={{ color: 'hsl(var(--foreground))' }}
                                        />
                                        <Line type="monotone" dataKey="accuracy" stroke="hsl(var(--healthy))" strokeWidth={3} dot={{ r: 4, fill: 'hsl(var(--healthy))', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Weak Concepts */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <BrainCircuit className="w-5 h-5 text-warning" />
                                <h3 className="text-lg font-semibold text-warning">Weak Concepts</h3>
                            </div>
                            <div className="p-6 rounded-xl bg-warning/5 border border-warning/10 h-[220px] flex flex-col justify-center">
                                <p className="text-sm text-muted-foreground mb-4 text-center">Concepts needing more focus based on recent recalls:</p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {mockWeakConcepts.map((concept, idx) => (
                                        <span key={idx} className="px-3 py-1.5 rounded-full bg-warning/20 text-warning text-xs font-medium border border-warning/30 hover:bg-warning/30 transition-colors cursor-default">
                                            {concept}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recall History Timeline */}
                    <div className="space-y-4 pb-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-semibold">Recall History</h3>
                        </div>
                        <div className="rounded-xl bg-card/40 border border-white/5 p-6 space-y-4">
                            {mockRecallHistory.map((history, idx) => (
                                <div key={history.id} className="relative flex items-center justify-between gap-4 p-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10 group">

                                    {/* Connector Line (except last) */}
                                    {idx !== mockRecallHistory.length - 1 && (
                                        <div className="absolute left-8 top-12 bottom-[-16px] w-[1px] bg-white/10 group-hover:bg-primary/30 transition-colors" />
                                    )}

                                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-black/40 text-primary shrink-0 z-10">
                                        <Award size={14} />
                                    </div>

                                    <div className="flex-1 flex flex-col">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-semibold text-foreground text-sm">{history.type}</span>
                                            <span className={`text-sm font-bold ${history.score > 90 ? 'text-healthy' : history.score > 80 ? 'text-warning' : 'text-critical'}`}>
                                                {history.score}% Accuracy
                                            </span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">{history.date}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SkillDetailsModal;
