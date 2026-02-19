/**
 * Calculate the predicted retention score based on exponential decay.
 * Formula: P = S * e^(-r * t)
 * @param {number} currentScore - The score at the last review (0-100).
 * @param {number} decayRate - The rate of decay (e.g., 0.1).
 * @param {number} daysSinceReview - Number of days since the last review.
 * @returns {number} - The predicted retention score (0-100).
 */
export const calculatePredictedRetention = (currentScore, decayRate, daysSinceReview) => {
    if (daysSinceReview < 0) return currentScore;
    const predicted = currentScore * Math.exp(-decayRate * daysSinceReview);
    return Math.max(0, Math.min(100, predicted));
};

/**
 * Calculate the number of days until retention drops to the critical threshold.
 * Formula derived from: critical = current * e^(-r * t) => t = -ln(critical/current) / r
 * @param {number} currentScore - The score at the last review.
 * @param {number} decayRate - The rate of decay.
 * @param {number} criticalThreshold - The score considered critical (e.g., 40).
 * @returns {number} - Days until critical (Infinity if never).
 */
export const calculateDaysUntilCritical = (currentScore, decayRate, criticalThreshold) => {
    if (currentScore <= criticalThreshold) return 0;
    if (decayRate <= 0) return Infinity;

    const days = -Math.log(criticalThreshold / currentScore) / decayRate;
    return Math.max(0, days);
};

/**
 * Suggest an optimal recall date based on avoiding the critical threshold.
 * We'll aim to recall at 10% above the critical threshold or halfway to critical.
 * For simplicity, let's suggest a date that is 80% of the way to the critical point.
 * @param {Date} lastReviewed - Date of the last review.
 * @param {number} daysUntilCritical - Calculated days until critical.
 * @returns {Date} - The suggested optimal recall date.
 */
export const suggestOptimalRecallDate = (lastReviewed, daysUntilCritical) => {
    if (!lastReviewed) return new Date();
    if (daysUntilCritical === Infinity) {
        // If no decay, review in 30 days by default
        const date = new Date(lastReviewed);
        date.setDate(date.getDate() + 30);
        return date;
    }

    // Suggest review at 90% of the safe interval
    const optimalDays = daysUntilCritical * 0.9;
    const date = new Date(lastReviewed);
    date.setDate(date.getDate() + optimalDays);
    return date;
};
