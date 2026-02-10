import { mockAnalytics, AnalyticsData } from '@/data/analytics.mock';

export const analyticsService = {
  getAnalytics: (): AnalyticsData => mockAnalytics,

  getRetentionTrend: () => mockAnalytics.retentionTrend,

  getSkillEngagement: () => mockAnalytics.skillEngagement,

  getDecayDistribution: () => mockAnalytics.decayDistribution,

  getWeeklyRecalls: () => mockAnalytics.weeklyRecalls,

  getSummaryStats: () => ({
    totalLearners: mockAnalytics.totalLearners,
    activeThisWeek: mockAnalytics.activeThisWeek,
    averageRetention: mockAnalytics.averageRetention,
    skillsTracked: mockAnalytics.skillsTracked,
    recallCompletionRate: mockAnalytics.recallCompletionRate,
  }),
};
