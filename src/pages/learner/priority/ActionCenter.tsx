import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Flame, ArrowRight, ShieldAlert, Target, Zap, Clock } from 'lucide-react';

import PageTransition from '@/components/PageTransition';
import { useLearner } from '@/context/LearnerContext';
import { calculatePriorityScore, sortSkillsByPriority, PriorityInput, UrgencyLevel } from '@/utils/priorityEngine';
import SkillDetailsModal from "@/components/modals/SkillDetailsModal";
import EmptyState from '@/components/empty-states/EmptyState';

// Helper interface for local sorting
interface PrioritizedSkill extends PriorityInput {
    id: string;
    name: string;
    category: string;
    scoreDisplay: number;
    healthColor: string;
    rawSkill: Record<string, unknown>; // Keep ref to original
}

const getUrgencyConfig = (level: UrgencyLevel) => {
    switch (level) {
        case 'Critical':
            return { icon: ShieldAlert, color: 'text-critical', bg: 'bg-critical/10', border: 'border-critical/30', glow: 'shadow-[0_0_20px_-5px_hsl(var(--critical)/0.4)]' };
        case 'High':
            return { icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30', glow: 'shadow-[0_0_20px_-5px_rgba(249,115,22,0.4)]' };
        case 'Medium':
            return { icon: Zap, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30', glow: 'shadow-[0_0_20px_-5px_hsl(var(--warning)/0.4)]' };
        case 'Low':
            return { icon: Target, color: 'text-healthy', bg: 'bg-healthy/10', border: 'border-healthy/30', glow: 'shadow-[0_0_20px_-5px_hsl(var(--healthy)/0.4)]' };
    }
};

const ActionCenter = () => {
    const navigate = useNavigate();
    const { skills, loading } = useLearner();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedSkill, setSelectedSkill] = React.useState<any>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    // Process and sort skills using Priority Engine
    const prioritizedSkills = useMemo(() => {
        if (!skills) return [];

        const learnedSkills = skills.filter(s => s.status === 'completed');

        const skillsWithPriority = learnedSkills.map(s => {
            // Mock metrics for Priority Engine if real data is missing from backend just for demonstration
            const currentRetention = s.retention?.health ?? 100;
            const decayRate = s.retention?.decayRate ?? 0.05;
            const predictedRetention = currentRetention * Math.exp(-decayRate * 3); // 3-day prediction

            const lastReviewDate = s.retention?.lastReviewed ? new Date(s.retention.lastReviewed) : new Date();
            const daysSinceLastReview = Math.floor((Date.now() - lastReviewDate.getTime()) / (1000 * 3600 * 24));

            const volatilityIndex = s.retention?.volatility ?? Math.random() * 10; // Mock volatility if missing

            const priorityInput: PrioritizedSkill = {
                id: s._id || s.id,
                name: s.title,
                category: s.category,
                currentRetention,
                predictedRetention,
                daysSinceLastReview: Math.max(0, daysSinceLastReview),
                volatilityIndex,
                rawSkill: s,
                scoreDisplay: currentRetention, // For UI
                healthColor: currentRetention > 90 ? 'text-healthy' : currentRetention > 70 ? 'text-warning' : 'text-critical'
            };

            return priorityInput;
        });

        return sortSkillsByPriority(skillsWithPriority);
    }, [skills]);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <PageTransition>
            <div className="max-w-6xl mx-auto space-y-8 pb-10">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                            <Flame className="text-orange-500 w-8 h-8" />
                            Action Center
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm md:text-base">
                            Your cognitive triage queue based on advanced retention analysis.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 bg-card/50 backdrop-blur-sm border border-white/5 py-2 px-4 rounded-xl">
                        <div className="text-sm">
                            <span className="text-muted-foreground">Highest Priority: </span>
                            <span className="font-bold text-critical">Critical</span>
                        </div>
                    </div>
                </div>

                {prioritizedSkills.length === 0 ? (
                    <EmptyState
                        icon={Target}
                        title="No Critical Targets"
                        description="Your knowledge base is stable. Learn new skills to populate the priority queue."
                        action={{ label: "Explore Skills", onClick: () => navigate('/learner/skills') }}
                    />
                ) : (
                    <div className="space-y-4">
                        {prioritizedSkills.map((skill, index) => {
                            const { priorityScore, urgencyLevel } = calculatePriorityScore(skill);
                            const config = getUrgencyConfig(urgencyLevel);
                            const Icon = config.icon;

                            return (
                                <motion.div
                                    key={skill.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.4 }}
                                    onClick={() => {
                                        setSelectedSkill(skill.rawSkill);
                                        setIsModalOpen(true);
                                    }}
                                    className={`relative flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-card/40 backdrop-blur-md border border-white/5 cursor-pointer hover:bg-card/60 transition-all duration-300 group overflow-hidden ${urgencyLevel === 'Critical' ? config.glow : 'hover:border-primary/30'}`}
                                >
                                    {/* Left urgency colored bar */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.bg} ${urgencyLevel === 'Critical' ? 'animate-pulse' : ''}`}></div>

                                    {/* Left info area */}
                                    <div className="flex items-center gap-5 z-10">
                                        <div className={`p-4 rounded-xl ${config.bg} ${config.border} border shrink-0 group-hover:scale-110 transition-transform`}>
                                            <Icon className={`w-6 h-6 ${config.color}`} />
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-3 mb-1.5">
                                                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase ${config.bg} ${config.color} border ${config.border}`}>
                                                    {urgencyLevel}
                                                </span>
                                                <span className="text-xs text-muted-foreground border border-white/10 px-2 py-0.5 rounded-md bg-white/5">
                                                    {skill.category}
                                                </span>
                                            </div>
                                            <h3 className="text-lg md:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                                {skill.name}
                                            </h3>
                                            <div className="flex items-center gap-4 text-xs mt-2 text-muted-foreground">
                                                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Reviewed {skill.daysSinceLastReview} days ago</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right metrics and action area */}
                                    <div className="flex items-center justify-between md:justify-end gap-8 z-10 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">

                                        {/* Stats */}
                                        <div className="flex items-center gap-8 md:gap-10">
                                            <div className="text-center">
                                                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Priority Factor</div>
                                                <div className={`text-2xl font-black font-mono tracking-tighter ${config.color}`}>
                                                    {Math.round(priorityScore)}
                                                </div>
                                            </div>
                                            <div className="hidden sm:block w-px h-10 bg-white/10"></div>
                                            <div className="text-center">
                                                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Retention</div>
                                                <div className={`text-2xl font-black tabular-nums tracking-tighter ${skill.healthColor}`}>
                                                    {Math.round(skill.scoreDisplay)}%
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/learner/recall/${skill.id}`);
                                            }}
                                            className={`hidden sm:flex items-center justify-center p-3 rounded-xl border ${config.border} text-foreground bg-white/5 hover:${config.bg} hover:${config.color} transition-colors group/btn`}
                                        >
                                            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                        </button>

                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            <SkillDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                skill={selectedSkill}
            />
        </PageTransition>
    );
};

export default ActionCenter;
