import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart2, Calendar, AlertCircle } from 'lucide-react';
import { getSkillHealth, type SkillHealthStatus } from '@/constants/skillLevels';
import { calculatePredictedRetention, calculateDaysUntilCritical } from '@/utils/retentionCalculator';
import ScoreRing from '@/components/charts/ScoreRing';
import SkillDecayGraph from '@/components/charts/SkillDecayGraph';

interface DetailedSkillCardProps {
    id: string;
    name: string;
    category: string;
    healthScore: number;
    learned: boolean;
    lastRecallDate?: string | null;
    decayRate?: number;
    criticalThreshold?: number;
    onClick?: () => void;
}

const statusColor: Record<SkillHealthStatus, string> = {
    healthy: 'text-healthy',
    at_risk: 'text-warning',
    critical: 'text-critical',
};

const statusBorder: Record<SkillHealthStatus, string> = {
    healthy: 'border-healthy/30 group-hover:border-healthy/60',
    at_risk: 'border-warning/30 group-hover:border-warning/60',
    critical: 'border-critical/30 group-hover:border-critical/60',
};

const DetailedSkillCard = ({
    id, name, category, healthScore, learned,
    lastRecallDate, decayRate = 0.05, criticalThreshold = 40, onClick
}: DetailedSkillCardProps) => {
    const navigate = useNavigate();
    const health = getSkillHealth(healthScore);
    const color = statusColor[health];
    const border = statusBorder[health];

    const daysToCritical = useMemo(() =>
        calculateDaysUntilCritical(healthScore, decayRate, criticalThreshold),
        [healthScore, decayRate, criticalThreshold]);

    const predictedRetention = useMemo(() =>
        calculatePredictedRetention(healthScore, 7, decayRate),
        [healthScore, decayRate]);

    return (
        <motion.div
            layout
            className={`group relative overflow-hidden rounded-xl bg-card/40 backdrop-blur-md border border-white/5 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${border} cursor-pointer`}
            onClick={() => onClick ? onClick() : navigate(`/learner/skill/${id}`)}
        >
            {/* Glow Effect */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-${health}`} />

            <div className="flex flex-col md:flex-row h-full">
                {/* Left Section */}
                <div className="flex-1 p-6 flex flex-col justify-between relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-widest bg-white/5 border border-white/10 text-muted-foreground/80">
                                {category}
                            </span>
                            {daysToCritical < 5 && (
                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-critical animate-pulse uppercase">
                                    <AlertCircle size={12} /> Critical Warning
                                </span>
                            )}
                        </div>

                        <h3 className="text-xl font-bold text-foreground mb-4 leading-tight group-hover:text-primary transition-colors">
                            {name}
                        </h3>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-6">
                            <div className="flex items-center gap-1.5">
                                <Calendar size={14} className="text-primary/70" />
                                Last reviewed: {lastRecallDate ? new Date(lastRecallDate).toLocaleDateString() : 'Never'}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mt-auto">
                        <button
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-all duration-300 group/btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/learner/recall/${id}`);
                            }}
                        >
                            Start Review <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                        <button
                            className="px-3 py-2.5 rounded-lg bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors"
                            title="View Analytics"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/learner/analytics/${id}`);
                            }}
                        >
                            <BarChart2 size={16} />
                        </button>
                    </div>
                </div>

                {/* Right Section - Visuals */}
                <div className="relative w-full md:w-2/5 min-h-[160px] bg-black/20 border-t md:border-t-0 md:border-l border-white/5 p-4 flex flex-col justify-center items-center overflow-hidden">

                    {/* Background Graph */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <SkillDecayGraph
                            currentScore={healthScore}
                            decayRate={decayRate}
                            height={200}
                            showAxes={false}
                        />
                    </div>

                    {/* Circular Indicator */}
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="relative mb-2">
                            <ScoreRing score={healthScore} size={80} strokeWidth={6} />
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-2xl font-black tabular-nums ${color}`}>
                                    {healthScore}%
                                </span>
                            </div>
                        </div>

                        <div className="text-center space-y-1">
                            <p className={`text-[10px] uppercase font-bold tracking-wider ${color}`}>
                                {health.replace('_', ' ')}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                                Predicted: <span className="text-foreground">{predictedRetention}%</span> in 7 days
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default DetailedSkillCard;
