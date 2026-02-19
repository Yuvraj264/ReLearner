export const calculatePredictedRetention = (
  currentScore: number,
  daysSinceLastReview: number,
  decayRate: number = 0.1
): number => {
  if (daysSinceLastReview < 0) return currentScore;
  const predicted = currentScore * Math.exp(-decayRate * daysSinceLastReview);
  return Math.max(0, Math.min(100, Math.round(predicted)));
};

export const calculateDaysUntilCritical = (
  currentScore: number,
  decayRate: number = 0.1,
  criticalThreshold: number = 40
): number => {
  if (currentScore <= criticalThreshold) return 0;
  if (decayRate <= 0) return Infinity;

  const days = -Math.log(criticalThreshold / currentScore) / decayRate;
  return Math.max(0, Math.ceil(days));
};

export const suggestOptimalRecallDate = (
  lastReviewed: string | null,
  daysUntilCritical: number
): Date => {
  if (!lastReviewed) return new Date();

  if (daysUntilCritical === Infinity) {
    const date = new Date(lastReviewed);
    date.setDate(date.getDate() + 30);
    return date;
  }

  // Suggest recall at 80% to critical, or at least tomorrow
  const optimalDays = Math.max(1, Math.floor(daysUntilCritical * 0.8));
  const date = new Date(lastReviewed);
  date.setDate(date.getDate() + optimalDays);
  return date;
};
