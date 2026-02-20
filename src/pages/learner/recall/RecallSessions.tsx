import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BrainCircuit,
  Flame,
  ShieldCheck,
  Zap,
  Clock,
  TrendingDown,
  Play,
  AlertOctagon,
  Sparkles
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import SkillCard from '@/components/cards/SkillCard';
import { skillService } from '@/services/skillService';
import { getSkillHealth } from '@/constants/skillLevels';
import { calculatePriorityScore, sortSkillsByPriority, generatePriorityExplanation, PriorityInput } from '@/utils/priorityEngine';

interface OptimizedSkill extends PriorityInput {
  id: string;
  name: string;
  category: string;
  reasoning: string;
  rawSkill: unknown;
}

const RecallSessions = () => {
  const navigate = useNavigate();
  const allSkills = skillService.getLearnedSkills();
  const [isOptimizing, setIsOptimizing] = React.useState(false);
  const [optimizedSchedule, setOptimizedSchedule] = React.useState<OptimizedSkill[]>([]);

  // Group skills by health status
  const { critical, atRisk, healthy } = useMemo(() => {
    return {
      critical: allSkills.filter(s => getSkillHealth(s.healthScore) === 'critical'),
      atRisk: allSkills.filter(s => getSkillHealth(s.healthScore) === 'at_risk'),
      healthy: allSkills.filter(s => getSkillHealth(s.healthScore) === 'healthy'),
    };
  }, [allSkills]);

  // Calculate Cognitive Load
  const cognitiveLoad = useMemo(() => {
    // Arbitrary weights: Critical = 15m, At Risk = 8m, Healthy = 2m
    const minutes = (critical.length * 15) + (atRisk.length * 8) + (healthy.length * 2);
    let level = 'Low';
    let color = 'text-healthy';

    if (minutes > 60) {
      level = 'High';
      color = 'text-critical';
    } else if (minutes > 30) {
      level = 'Moderate';
      color = 'text-warning';
    }

    return { minutes, level, color };
  }, [critical, atRisk, healthy]);

  const handleOptimize = () => {
    setIsOptimizing(true);
    setOptimizedSchedule([]);

    // Simulate backend engine run
    setTimeout(() => {
      const skillsWithPriority = allSkills.map(s => {
        const currentRetention = s.healthScore ?? 100;
        const decayRate = s.decayRate ?? 0.05;
        const predictedRetention = currentRetention * Math.exp(-decayRate * 3);
        const lastReviewDate = s.lastRecallDate ? new Date(s.lastRecallDate) : new Date();
        const daysSinceLastReview = Math.floor((Date.now() - lastReviewDate.getTime()) / (1000 * 3600 * 24));
        const volatilityIndex = s.decayRate ? s.decayRate * 100 : Math.random() * 10;

        const priorityInput: OptimizedSkill = {
          id: s.id,
          name: s.name,
          category: s.category,
          currentRetention,
          predictedRetention,
          daysSinceLastReview: Math.max(0, daysSinceLastReview),
          volatilityIndex,
          rawSkill: s,
          reasoning: ''
        };
        return priorityInput;
      });

      const sorted = sortSkillsByPriority(skillsWithPriority);
      const top3 = sorted.slice(0, 3);

      // Generate localized reasoning based on the inputs
      const scheduled = top3.map(skill => {
        const reasoning = generatePriorityExplanation(skill);
        return { ...skill, reasoning };
      });

      setOptimizedSchedule(scheduled);
      setIsOptimizing(false);
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-8 pb-10">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <BrainCircuit className="text-primary w-8 h-8" />
              Recall Engine
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">
              Priority-based system to optimize your retention.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="glass-card px-4 py-2 flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] uppercase text-muted-foreground font-semibold">Cognitive Load</p>
                <p className={`text-sm font-bold ${cognitiveLoad.color} flex items-center justify-end gap-1`}>
                  {cognitiveLoad.level}
                  <span className="text-muted-foreground font-normal">({Math.round(cognitiveLoad.minutes)}m)</span>
                </p>
              </div>
              <div className={`p-2 rounded-full bg-background/50 ring-1 ring-white/10 ${cognitiveLoad.level === 'High' ? 'animate-pulse' : ''}`}>
                <Zap size={18} className={cognitiveLoad.color} />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOptimize}
              disabled={isOptimizing}
              className={`btn-glow px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-lg transition-all ${isOptimizing ? 'bg-primary/50 text-primary-foreground/50 cursor-not-allowed shadow-none' : 'bg-primary text-primary-foreground shadow-primary/20'}`}
            >
              {isOptimizing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"></div>
                  Optimizing...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Auto Optimize
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Optimized Schedule Overlay / Section */}
        <AnimatePresence>
          {optimizedSchedule.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden backdrop-blur-sm">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="flex items-center gap-3 text-primary relative z-10">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                  <h2 className="text-xl font-bold tracking-tight">AI Optimized Session</h2>
                  <span className="bg-primary/20 text-primary text-xs font-mono px-2 py-0.5 rounded-md border border-primary/20 ml-auto">
                    READY
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                  {optimizedSchedule.map((skill, idx) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.15 + 0.2 }}
                      className="bg-card/50 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-primary/40 hover:bg-card/80 transition-all group flex flex-col"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold">
                            {idx + 1}
                          </div>
                          <span className="text-xs text-muted-foreground font-mono">{skill.category}</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">{skill.name}</h3>

                      <div className="flex p-3 rounded-lg bg-background/50 border border-white/5 mb-4 grow">
                        <p className="text-xs text-muted-foreground/90 leading-relaxed font-medium">
                          <AlertOctagon className="w-3.5 h-3.5 inline-block mr-1.5 text-warning -mt-0.5" />
                          {skill.reasoning}
                        </p>
                      </div>

                      <button
                        onClick={() => navigate(`/learner/recall/${skill.id}`)}
                        className="w-full py-2.5 rounded-lg bg-white/5 hover:bg-primary hover:text-primary-foreground text-foreground border border-white/10 hover:border-primary transition-all text-sm font-semibold flex items-center justify-center gap-2 mt-auto"
                      >
                        <Play className="w-4 h-4" /> Start Review
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Priority 1: CRITICAL (Red Zone) */}
        {critical.length > 0 && (
          <motion.section
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-critical">
              <div className="relative">
                <div className="absolute inset-0 bg-critical blur-md opacity-40 animate-pulse"></div>
                <AlertOctagon className="relative w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold uppercase tracking-wider">Critical Attention Needed</h2>
              <span className="bg-critical/10 text-critical text-[10px] px-2 py-0.5 rounded-full border border-critical/20 font-mono">
                TOP PRIORITY
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {critical.map(skill => (
                <motion.div key={skill.id} variants={itemVariants}>
                  <SkillCard
                    {...skill}
                    modulesCompleted={skill.modules.filter(m => m.completed).length}
                    totalModules={skill.modules.length}
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Priority 2: HIGH RISK (Orange Zone) */}
        {atRisk.length > 0 && (
          <motion.section
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-warning pt-4">
              <Flame className="w-5 h-5" />
              <h2 className="text-lg font-bold uppercase tracking-wider">High Risk Watchlist</h2>
              <span className="bg-warning/10 text-warning text-[10px] px-2 py-0.5 rounded-full border border-warning/20 font-mono">
                DECAYING FAST
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {atRisk.map(skill => (
                <motion.div key={skill.id} variants={itemVariants}>
                  <SkillCard
                    {...skill}
                    modulesCompleted={skill.modules.filter(m => m.completed).length}
                    totalModules={skill.modules.length}
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Priority 3: STABLE (Green Zone) */}
        {healthy.length > 0 && (
          <motion.section
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-healthy pt-4">
              <ShieldCheck className="w-5 h-5" />
              <h2 className="text-lg font-bold uppercase tracking-wider">Stable</h2>
              <span className="bg-healthy/10 text-healthy text-[10px] px-2 py-0.5 rounded-full border border-healthy/20 font-mono">
                MAINTENANCE
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {healthy.map(skill => (
                <motion.button
                  key={skill.id}
                  variants={itemVariants}
                  onClick={() => navigate(`/learner/skill/${skill.id}`)}
                  className="glass-card-hover p-4 text-left group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] text-muted-foreground">{skill.category}</span>
                    <span className="text-xs font-bold text-healthy">{skill.healthScore}%</span>
                  </div>
                  <h3 className="text-sm font-medium text-foreground truncate pr-2">{skill.name}</h3>
                  <div className="absolute bottom-0 left-0 h-0.5 bg-healthy/30 w-full">
                    <div className="h-full bg-healthy" style={{ width: `${skill.healthScore}%` }} />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.section>
        )}

        {allSkills.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="p-4 rounded-full bg-primary/10">
              <BrainCircuit className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground">No Skills Found</h3>
            <p className="text-muted-foreground max-w-md">
              Start learning new skills to populate your Recall Engine.
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default RecallSessions;
