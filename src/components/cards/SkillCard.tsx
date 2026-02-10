import React from 'react';
import { motion } from 'framer-motion';
import { getScoreColor, getScoreLabel } from '@/utils/scoreUtils';
import { getSkillHealth, type SkillHealthStatus } from '@/constants/skillLevels';
import ScoreRing from '@/components/charts/ScoreRing';
import { useNavigate } from 'react-router-dom';

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

const statusBadge: Record<SkillHealthStatus, string> = {
  healthy: 'bg-healthy/15 text-healthy border-healthy/20',
  at_risk: 'bg-warning/15 text-warning border-warning/20',
  critical: 'bg-critical/15 text-critical border-critical/20',
};

const statusLabel: Record<SkillHealthStatus, string> = {
  healthy: 'Healthy',
  at_risk: 'At Risk',
  critical: 'Critical',
};

const SkillCard = ({
  id, name, category, healthScore, learned, enrolled,
  nextRecallDate, modulesCompleted, totalModules,
}: SkillCardProps) => {
  const navigate = useNavigate();
  const health = getSkillHealth(healthScore);

  return (
    <motion.div
      className="glass-card-hover p-5 cursor-pointer"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/learner/skill/${id}`)}
      layout
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 mr-3">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{category}</span>
          <h3 className="text-sm font-semibold text-foreground mt-1 truncate">{name}</h3>
        </div>
        {learned && <ScoreRing score={healthScore} size={52} strokeWidth={4} />}
      </div>

      {learned ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${statusBadge[health]}`}>
              {statusLabel[health]}
            </span>
            <span className={`text-xs ${getScoreColor(healthScore)}`}>{getScoreLabel(healthScore)}</span>
          </div>
          {nextRecallDate && (
            <p className="text-xs text-muted-foreground">
              Next recall: {new Date(nextRecallDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          )}
        </div>
      ) : enrolled ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{modulesCompleted}/{totalModules} modules</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(modulesCompleted / totalModules) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">Not enrolled</p>
      )}
    </motion.div>
  );
};

export default SkillCard;
