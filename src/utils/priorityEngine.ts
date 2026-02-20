export type UrgencyLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export interface PriorityInput {
    currentRetention: number;
    predictedRetention: number;
    daysSinceLastReview: number;
    volatilityIndex: number;
}

export interface PriorityResult {
    priorityScore: number;
    urgencyLevel: UrgencyLevel;
}

export interface SkillWithPriority extends PriorityInput {
    id: string;
    // allow other properties on the skill object
    [key: string]: unknown;
}

/**
 * Calculates the priority score and urgency level for a skill.
 * 
 * Formula:
 * PriorityScore = (100 - predictedRetention) + (daysSinceLastReview * 2) + (volatilityIndex * 5)
 * 
 * @param input The inputs required for the priority engine.
 * @returns An object containing the exact priorityScore and the categorized urgencyLevel.
 */
export const calculatePriorityScore = (input: PriorityInput): PriorityResult => {
    const { predictedRetention, daysSinceLastReview, volatilityIndex } = input;

    // Ensure predictedRetention is capped between 0 and 100
    const normalizedRetention = Math.max(0, Math.min(100, predictedRetention));

    const priorityScore =
        (100 - normalizedRetention) +
        (daysSinceLastReview * 2) +
        (volatilityIndex * 5);

    // Determine urgency level based on the resulting score
    // Assuming a max possible score around ~200+
    let urgencyLevel: UrgencyLevel;
    if (priorityScore >= 120) {
        urgencyLevel = 'Critical';
    } else if (priorityScore >= 80) {
        urgencyLevel = 'High';
    } else if (priorityScore >= 40) {
        urgencyLevel = 'Medium';
    } else {
        urgencyLevel = 'Low';
    }

    return {
        priorityScore,
        urgencyLevel,
    };
};

/**
 * Sorts an array of skills by highest priority score first.
 * The skills must contain the properties defined in PriorityInput.
 * 
 * @param skills Array of skills to sort
 * @returns A new array of skills sorted by priority (descending).
 */
export const sortSkillsByPriority = <T extends PriorityInput>(skills: T[]): T[] => {
    return [...skills].sort((a, b) => {
        const scoreA = calculatePriorityScore(a).priorityScore;
        const scoreB = calculatePriorityScore(b).priorityScore;

        // Sort descending (highest priority first)
        return scoreB - scoreA;
    });
};

/**
 * Generates a short, human-readable explanation of why a skill is prioritized.
 * 
 * @param skill The skill inputs containing current retention, predicted retention, etc.
 * @returns A concise string explaining the priority.
 */
export const generatePriorityExplanation = (skill: PriorityInput): string => {
    const { priorityScore } = calculatePriorityScore(skill);

    if (skill.volatilityIndex > 7) {
        return `High volatility detected. Predicted ${skill.currentRetention - skill.predictedRetention > 15 ? 'sharp' : 'steady'} drop to ${Math.round(skill.predictedRetention)}%.`;
    }

    if (skill.daysSinceLastReview > 7) {
        return `Overdue. It's been ${skill.daysSinceLastReview} days since your last review.`;
    }

    return `Priority Factor ${Math.round(priorityScore)} requires immediate reinforcement.`;
};
