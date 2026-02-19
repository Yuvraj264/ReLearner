import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { getScoreColor, getScoreLabel } from '@/utils/scoreUtils';
import { getSkillHealth, type SkillHealthStatus } from '@/constants/skillLevels';
import ScoreRing from '@/components/charts/ScoreRing';
import { useNavigate } from 'react-router-dom';
import { Activity, AlertTriangle, ArrowDown, Calculator, CalendarClock, TrendingDown } from 'lucide-react';

interface SkillCardProps {
  id: string;
  name: string;
  category: string;
  healthScore: number;
  learned: boolean;
  enrolled: boolean;
  nextRecallDate: string | null;
  modulesCompleted: number;
  totalModules: number;
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

const MiniDecayGraph = ({ health, color }: { health: SkillHealthStatus, color: string }) => {
  // Simulate a decay curve based on health
  const points = useMemo(() => {
    const startY = health === 'healthy' ? 80 : health === 'at_risk' ? 50 : 20;
    const endY = Math.max(0, startY - 15); // Drop over 3 days
    return `M 0 ${100 - startY} Q 50 ${100 - startY + 5}, 100 ${100 - endY}`;
  }, [health]);

  const strokeColor = health === 'healthy' ? 'var(--healthy)' : health === 'at_risk' ? 'var(--warning)' : 'var(--critical)';

  return (
    <div className="absolute bottom-0 right-0 w-24 h-12 opacity-30 pointer-events-none overflow-hidden">
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.path
          d={points}
          fill="none"
          stroke={`hsl(${strokeColor})`}
          strokeWidth="4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        <path d={points} fill="none" stroke={`hsl(${strokeColor})`} strokeWidth="8" className="blur-sm opacity-50" />
      </svg>
    </div>
  );
};

const SkillCard = ({
  id, name, category, healthScore, learned, enrolled,
  nextRecallDate, modulesCompleted, totalModules,
}: SkillCardProps) => {
  const navigate = useNavigate();
  const health = getSkillHealth(healthScore);

  // Simulate predictive metrics for the dashboard feel
  const projectedRetention = Math.max(0, healthScore - 3); // Lose 3% in 3 days roughly
  const daysToCritical = Math.max(0, Math.floor((healthScore - 40) / 1.5)); // Approx days until < 40%

  return (
    <motion.div
      className={`glass-card relative overflow-hidden group cursor-pointer border transition-all duration-300 ${learned ? statusGlow[health] : 'border-glass-border hover:border-primary/30 hover:shadow-glow-primary'}`}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/learner/skill/${id}`)}
      layout
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="p-5 relative z-10 flex flex-col h-full justify-between">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-secondary/50 text-muted-foreground border border-white/5 mb-1.5 backdrop-blur-sm">
              {category}
            </span>
            <h3 className="text-base font-bold text-foreground leading-tight tracking-tight">{name}</h3>
          </div>
          {learned && (
            <div className={`p-1.5 rounded-full bg-background/20 backdrop-blur-md border border-white/10 ${statusTextNeon[health]}`}>
              {health === 'healthy' ? <Activity size={16} /> : <AlertTriangle size={16} />}
            </div>
          )}
        </div>

        {learned ? (
          <>
            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                  Current Retention
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-bold tracking-tighter ${statusTextNeon[health]}`}>
                    {healthScore}%
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">{getScoreLabel(healthScore)}</span>
                </div>
              </div>
              <div className="flex justify-end items-center">
                <ScoreRing score={healthScore} size={48} strokeWidth={5} />
              </div>
            </div>

            {/* Predictive Footer */}
            <div className="grid grid-cols-2 gap-2 mt-auto pt-3 border-t border-white/5 bg-black/20 -mx-5 -mb-5 px-5 pb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <TrendingDown size={10} /> 3-Day Projection
                </span>
                <div className="text-sm font-semibold text-foreground/90 tabular-nums">
                  {projectedRetention}% <span className="text-[10px] text-critical font-medium">(-3%)</span>
                </div>
              </div>

              <div className="space-y-0.5 text-right">
                <span className="text-[10px] text-muted-foreground flex items-center justify-end gap-1">
                  <CalendarClock size={10} /> Critical In
                </span>
                <div className={`text-sm font-semibold tabular-nums ${daysToCritical <= 2 ? 'text-critical animate-pulse' : 'text-foreground/90'}`}>
                  {daysToCritical > 0 ? `${daysToCritical} Days` : 'Now'}
                </div>
              </div>
            </div>

            <MiniDecayGraph health={health} color="" />
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
