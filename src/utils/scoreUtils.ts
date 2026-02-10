export const getScoreColor = (score: number): string => {
  if (score >= 70) return 'text-healthy';
  if (score >= 40) return 'text-warning';
  return 'text-critical';
};

export const getScoreBgColor = (score: number): string => {
  if (score >= 70) return 'bg-healthy';
  if (score >= 40) return 'bg-warning';
  return 'bg-critical';
};

export const getScoreGlow = (score: number): string => {
  if (score >= 70) return 'glow-healthy';
  if (score >= 40) return 'glow-warning';
  return 'glow-critical';
};

export const getScoreLabel = (score: number): string => {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 55) return 'Fair';
  if (score >= 40) return 'Needs Review';
  return 'Critical';
};

export const calculateOverallScore = (scores: number[]): number => {
  if (scores.length === 0) return 0;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
};
