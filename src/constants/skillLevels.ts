export const SKILL_LEVELS = {
  BEGINNER: { key: 'beginner', label: 'Beginner', minScore: 0 },
  INTERMEDIATE: { key: 'intermediate', label: 'Intermediate', minScore: 30 },
  ADVANCED: { key: 'advanced', label: 'Advanced', minScore: 60 },
  EXPERT: { key: 'expert', label: 'Expert', minScore: 85 },
} as const;

export const SKILL_HEALTH = {
  HEALTHY: { key: 'healthy', label: 'Healthy', minScore: 70, color: 'healthy' },
  AT_RISK: { key: 'at_risk', label: 'At Risk', minScore: 40, color: 'warning' },
  CRITICAL: { key: 'critical', label: 'Critical', minScore: 0, color: 'critical' },
} as const;

export type SkillHealthStatus = 'healthy' | 'at_risk' | 'critical';

export const getSkillHealth = (score: number): SkillHealthStatus => {
  if (score >= 70) return 'healthy';
  if (score >= 40) return 'at_risk';
  return 'critical';
};
