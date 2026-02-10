export const RECALL_INTERVALS = {
  INITIAL: 1,       // 1 day after learning
  SECOND: 3,        // 3 days
  THIRD: 7,         // 1 week
  FOURTH: 14,       // 2 weeks
  FIFTH: 30,        // 1 month
  SIXTH: 60,        // 2 months
  SEVENTH: 90,      // 3 months
  MAINTENANCE: 120,  // 4 months ongoing
} as const;

export const RECALL_INTERVAL_LIST = [1, 3, 7, 14, 30, 60, 90, 120];

export const DECAY_RATES = {
  FAST: 0.85,
  MODERATE: 0.92,
  SLOW: 0.96,
} as const;

export const RECALL_SESSION_CONFIG = {
  MIN_QUESTIONS: 3,
  MAX_QUESTIONS: 5,
  MAX_DURATION_SECONDS: 180, // 3 minutes
  PASSING_SCORE: 70,
} as const;
