export interface PressureScoreResult {
    score: number;
    interpretation: 'Elite Stability' | 'Stable' | 'Moderate Under Pressure' | 'High Stress Drop';
}

/**
 * Calculates a Pressure Performance Score based on accuracy and time constraints.
 * 
 * Formula: pressureScore = accuracyPercentage * (1 - timeRemainingPercentage)
 * 
 * Normalized 0-100.
 * 
 * @param accuracyPercentage 0 to 100
 * @param timeRemainingPercentage 0 to 1
 * @returns Object with score and interpretation string.
 */
export const calculatePressurePerformance = (
    accuracyPercentage: number,
    timeRemainingPercentage: number
): PressureScoreResult => {
    // Ensure inputs are bounded
    const safeAccuracy = Math.max(0, Math.min(100, accuracyPercentage));
    const safeTimeRemaining = Math.max(0, Math.min(1, timeRemainingPercentage));

    // Apply formula
    const rawScore = safeAccuracy * (1 - safeTimeRemaining);
    const score = Math.round(Math.max(0, Math.min(100, rawScore)));

    let interpretation: PressureScoreResult['interpretation'] = 'High Stress Drop';

    if (score >= 80) {
        interpretation = 'Elite Stability';
    } else if (score >= 60) {
        interpretation = 'Stable';
    } else if (score >= 40) {
        interpretation = 'Moderate Under Pressure';
    } else {
        interpretation = 'High Stress Drop';
    }

    return {
        score,
        interpretation
    };
};
