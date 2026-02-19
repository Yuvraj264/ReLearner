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

const RecallSessions = () => {
  const navigate = useNavigate();
  const allSkills = skillService.getLearnedSkills();

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
              className="btn-glow bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-primary/20"
            >
              <Sparkles size={16} />
              Auto Optimize
            </motion.button>
          </div>
        </div>

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
                  <SkillCard {...skill} />
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
                  <SkillCard {...skill} />
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
