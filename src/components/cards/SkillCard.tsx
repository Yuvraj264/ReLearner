import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { getScoreColor, getScoreLabel } from '@/utils/scoreUtils';
import { getSkillHealth, type SkillHealthStatus } from '@/constants/skillLevels';
import { calculatePredictedRetention, calculateDaysUntilCritical, suggestOptimalRecallDate } from '@/utils/retentionCalculator';
import ScoreRing from '@/components/charts/ScoreRing';
import { useNavigate } from 'react-router-dom';
import { Activity, AlertTriangle, ArrowDown, Calculator, CalendarClock, TrendingDown, Clock, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SkillCardProps {
  id: string;
  name: string;
  category: string;
  healthScore: number;
  learned: boolean;
  enrolled: boolean;
  nextRecallDate: string | null;
  lastRecallDate?: string | null;
  modulesCompleted: number;
  totalModules: number;
  decayRate?: number;
  criticalThreshold?: number;
  onClick?: () => void;
}

const statusGlow: Record<SkillHealthStatus, string> = {
  healthy: 'hover:shadow-[0_0_30px_-5px_hsl(var(--healthy)/0.5)] border-healthy/30',
  at_risk: 'hover:shadow-[0_0_30px_-5px_hsl(var(--warning)/0.5)] border-warning/30',
  critical: 'hover:shadow-[0_0_30px_-5px_hsl(var(--critical)/0.5)] border-critical/30',
};

const statusTextNeon: Record<SkillHealthStatus, string> = {
  healthy: 'text-healthy text-neon-healthy',
  at_risk: 'text-warning text-neon-warning',
  critical: 'text-critical text-neon-critical',
};

const MiniDecayGraph = ({ currentScore, decayRate = 0.1, color }: { currentScore: number, decayRate?: number, color: string }) => {
  // Generate exact decay curve points for visual accuracy
  const points = useMemo(() => {
    // Show a 14-day projection
    const days = 14;
    let d = `M 0 ${100 - currentScore}`;

    for (let day = 1; day <= days; day++) {
      // P = S * e^(-r * t)
      // We start from currentScore as t=0 relative to the graph start
      const predicted = currentScore * Math.exp(-decayRate * day);
      const x = (day / days) * 100;
      const y = 100 - predicted;
      d += ` L ${x} ${y}`;
    }

    return d;
  }, [currentScore, decayRate]);

  return (
    <div className="absolute bottom-0 right-0 w-32 h-16 opacity-20 pointer-events-none overflow-hidden">
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.path
          d={points}
          fill="none"
          stroke={color}
          strokeWidth="3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        {/* Fill area under curve */}
        <path d={`${points} L 100 100 L 0 100 Z`} fill={color} fillOpacity="0.2" />
      </svg>
    </div>
  );
};

const SkillCard = ({
  id, name, category, healthScore, learned, enrolled,
  nextRecallDate, lastRecallDate, modulesCompleted, totalModules,
  decayRate = 0.1, criticalThreshold = 40, onClick
}: SkillCardProps) => {
  const navigate = useNavigate();
  const health = getSkillHealth(healthScore);

  // Real Predictive Calcs
  const projectedRetention = useMemo(() => {
    // Predict score in 3 days
    return calculatePredictedRetention(healthScore, 3, decayRate);
  }, [healthScore, decayRate]);

  const daysToCritical = useMemo(() => {
    return calculateDaysUntilCritical(healthScore, decayRate, criticalThreshold);
  }, [healthScore, decayRate, criticalThreshold]);

  const suggestedDate = useMemo(() => {
    return suggestOptimalRecallDate(lastRecallDate || new Date().toISOString(), daysToCritical);
  }, [lastRecallDate, daysToCritical]);

  const strokeColor = health === 'healthy' ? 'var(--healthy)' : health === 'at_risk' ? 'var(--warning)' : 'var(--critical)';

  return (
    <motion.div
      className={`glass-card relative overflow-hidden group cursor-pointer border transition-all duration-300 ${learned ? statusGlow[health] : 'border-glass-border hover:border-primary/30 hover:shadow-glow-primary'}`}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick ? onClick() : navigate(`/learner/skill/${id}`)}
      layout
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Risk Badge (Top Right) */}
      {learned && (
        <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border-b border-l border-white/10 ${health === 'healthy' ? 'bg-healthy/10 text-healthy' :
          health === 'at_risk' ? 'bg-warning/10 text-warning' : 'bg-critical/10 text-critical animate-pulse'
          }`}>
          {health.replace('_', ' ')}
        </div>
      )}

      <div className="p-5 relative z-10 flex flex-col h-full justify-between">
        {/* Header */}
        <div className="flex justify-between items-start mb-4 pr-16">
          <div>
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-secondary/50 text-muted-foreground border border-white/5 mb-1.5 backdrop-blur-sm">
              {category}
            </span>
            <h3 className="text-base font-bold text-foreground leading-tight tracking-tight line-clamp-2">{name}</h3>
          </div>
        </div>

        {learned ? (
          <>
            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1 z-20">
                <div className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                  Retention Score
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-black tracking-tighter ${statusTextNeon[health]}`}>
                    {healthScore}%
                  </span>
                </div>
                {daysToCritical < 5 && (
                  <div className="flex items-center gap-1 text-[10px] text-critical font-medium animate-pulse">
                    <AlertCircle size={10} /> Critical in {daysToCritical === 0 ? 'many' : daysToCritical} days
                  </div>
                )}
              </div>
              <div className="flex justify-end items-center relative z-20">
                <ScoreRing score={healthScore} size={56} strokeWidth={6} />
              </div>
            </div>

            {/* Predictive Footer - Darker & Glassier */}
            <div className="grid grid-cols-2 gap-3 mt-auto pt-3 border-t border-white/5 bg-black/20 -mx-5 -mb-5 px-5 pb-4 backdrop-blur-[2px]">

              {/* 3-Day Forecast */}
              <div className="space-y-0.5">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                  <TrendingDown size={12} className="text-muted-foreground/70" />
                  3-Day Forecast
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground/90 tabular-nums">{projectedRetention}%</span>
                  <span className="text-[10px] text-critical font-medium bg-critical/10 px-1 rounded">
                    {projectedRetention - healthScore}%
                  </span>
                </div>
              </div>

              {/* Suggested Recall */}
              <div className="space-y-0.5 text-right">
                <span className="text-[10px] text-muted-foreground flex items-center justify-end gap-1.5">
                  <CalendarClock size={12} className="text-muted-foreground/70" />
                  Optimal Recall
                </span>
                <div className="text-sm font-semibold text-foreground/90 tabular-nums">
                  {suggestedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
              </div>
            </div>

            <MiniDecayGraph currentScore={healthScore} decayRate={decayRate} color={`hsl(${strokeColor})`} />
          </>
        ) : enrolled ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Progress</span>
              <span className="text-xs font-mono text-primary">{Math.round((modulesCompleted / totalModules) * 100)}%</span>
            </div>

            {/* Custom Progress Bar */}
            <div className="h-2 bg-secondary/50 rounded-full overflow-hidden relative">
              <motion.div
                className="absolute inset-y-0 left-0 bg-primary shadow-[0_0_10px_hsl(var(--primary))]"
                initial={{ width: 0 }}
                animate={{ width: `${(modulesCompleted / totalModules) * 100}%` }}
                transition={{ duration: 1, ease: "circOut" }}
              />
            </div>

            <div className="flex justify-between text-[10px] text-muted-foreground pt-1">
              <span>{modulesCompleted} modules done</span>
              <span>{totalModules - modulesCompleted} to go</span>
            </div>
          </div>
        ) : (
          <div className="mt-auto pt-4 border-t border-white/5">
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-muted-foreground/30"></span>
              Not Enrolled
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SkillCard;

