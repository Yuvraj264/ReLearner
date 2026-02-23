export interface AdaptiveDifficultyState {
    currentLevel: number;
    consecutiveCorrect: number;
}

/**
 * Calculates the next difficulty level based on the current state and the user's performance.
 * 
 * Logic:
 * - If correct 2 times consecutively -> increase difficulty (cap at 5)
 * - If incorrect -> decrease difficulty (min 1)
 * 
 * @param state The current difficulty state including consecutive correct answers.
 * @param isCorrect Whether the previous answer was correct.
 * @returns The new adaptive difficulty state.
 */
export const calculateNextDifficulty = (
    state: AdaptiveDifficultyState,
    isCorrect: boolean
): AdaptiveDifficultyState => {
    let { currentLevel, consecutiveCorrect } = state;

    if (isCorrect) {
        consecutiveCorrect += 1;
        if (consecutiveCorrect >= 2) {
            currentLevel = Math.min(5, currentLevel + 1);
            consecutiveCorrect = 0; // Reset consecutive count after leveling up
        }
    } else {
        consecutiveCorrect = 0;
        currentLevel = Math.max(1, currentLevel - 1);
    }

    return {
        currentLevel,
        consecutiveCorrect,
    };
};

/**
 * Helper to map a 1-5 difficulty level to a human-readable label or badge style if needed.
 */
export const getDifficultyLabel = (level: number): 'Beginner' | 'Intermediate' | 'Medium' | 'Hard' | 'Extreme' => {
    switch (level) {
        case 1: return 'Beginner';
        case 2: return 'Intermediate';
        case 3: return 'Medium';
        case 4: return 'Hard';
        case 5: return 'Extreme';
        default: return 'Medium';
    }
};
