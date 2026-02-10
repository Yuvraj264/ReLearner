import { DECAY_RATES } from '@/constants/recallIntervals';

export const calculateRetention = (
  initialScore: number,
  daysSinceLastRecall: number,
  decayRate: number = DECAY_RATES.MODERATE
): number => {
  const retention = initialScore * Math.pow(decayRate, daysSinceLastRecall / 7);
  return Math.max(0, Math.min(100, Math.round(retention)));
};

export const calculateDecayRate = (
  recallHistory: { score: number; date: string }[]
): number => {
  if (recallHistory.length < 2) return DECAY_RATES.MODERATE;
  const avgScore = recallHistory.reduce((sum, r) => sum + r.score, 0) / recallHistory.length;
  if (avgScore >= 85) return DECAY_RATES.SLOW;
  if (avgScore >= 60) return DECAY_RATES.MODERATE;
  return DECAY_RATES.FAST;
};

export const getNextRecallDate = (
  lastRecallDate: string,
  intervalDays: number
): string => {
  const date = new Date(lastRecallDate);
  date.setDate(date.getDate() + intervalDays);
  return date.toISOString();
};

export const getDaysUntilNextRecall = (nextRecallDate: string): number => {
  const now = new Date();
  const next = new Date(nextRecallDate);
  const diff = next.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};
