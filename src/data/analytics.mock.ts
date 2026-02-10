export interface AnalyticsData {
  totalLearners: number;
  activeThisWeek: number;
  averageRetention: number;
  skillsTracked: number;
  recallCompletionRate: number;
  atRiskSkills: number;
  criticalSkills: number;
  healthySkills: number;
  retentionTrend: { date: string; score: number }[];
  skillEngagement: { skill: string; learners: number; avgScore: number; status: string }[];
  decayDistribution: { range: string; count: number }[];
  weeklyRecalls: { week: string; completed: number; missed: number }[];
}

export const mockAnalytics: AnalyticsData = {
  totalLearners: 2847,
  activeThisWeek: 1923,
  averageRetention: 68,
  skillsTracked: 156,
  recallCompletionRate: 73,
  atRiskSkills: 42,
  criticalSkills: 18,
  healthySkills: 96,
  retentionTrend: [
    { date: '2025-09', score: 58 },
    { date: '2025-10', score: 62 },
    { date: '2025-11', score: 65 },
    { date: '2025-12', score: 63 },
    { date: '2026-01', score: 68 },
    { date: '2026-02', score: 71 },
  ],
  skillEngagement: [
    { skill: 'React Architecture', learners: 456, avgScore: 78, status: 'healthy' },
    { skill: 'SQL Optimization', learners: 389, avgScore: 55, status: 'at_risk' },
    { skill: 'System Design', learners: 523, avgScore: 42, status: 'at_risk' },
    { skill: 'TypeScript Types', learners: 312, avgScore: 81, status: 'healthy' },
    { skill: 'Docker', learners: 278, avgScore: 35, status: 'critical' },
    { skill: 'REST APIs', learners: 445, avgScore: 72, status: 'healthy' },
  ],
  decayDistribution: [
    { range: '0-20', count: 12 },
    { range: '21-40', count: 18 },
    { range: '41-60', count: 34 },
    { range: '61-80', count: 52 },
    { range: '81-100', count: 40 },
  ],
  weeklyRecalls: [
    { week: 'W1', completed: 1245, missed: 340 },
    { week: 'W2', completed: 1380, missed: 290 },
    { week: 'W3', completed: 1190, missed: 420 },
    { week: 'W4', completed: 1450, missed: 260 },
    { week: 'W5', completed: 1520, missed: 210 },
    { week: 'W6', completed: 1610, missed: 180 },
  ],
};
