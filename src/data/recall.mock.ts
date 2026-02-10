export interface RecallSession {
  id: string;
  skillId: string;
  skillName: string;
  date: string;
  score: number;
  questionsAnswered: number;
  totalQuestions: number;
  durationSeconds: number;
  passed: boolean;
}

export const mockRecallSessions: RecallSession[] = [
  { id: 'rs-1', skillId: 'skill-1', skillName: 'React Component Architecture', date: '2026-02-07T10:30:00Z', score: 88, questionsAnswered: 4, totalQuestions: 4, durationSeconds: 145, passed: true },
  { id: 'rs-2', skillId: 'skill-2', skillName: 'SQL Query Optimization', date: '2026-01-15T14:20:00Z', score: 52, questionsAnswered: 3, totalQuestions: 3, durationSeconds: 160, passed: false },
  { id: 'rs-3', skillId: 'skill-3', skillName: 'System Design Fundamentals', date: '2025-12-28T09:00:00Z', score: 31, questionsAnswered: 4, totalQuestions: 4, durationSeconds: 170, passed: false },
  { id: 'rs-4', skillId: 'skill-6', skillName: 'TypeScript Advanced Types', date: '2026-02-03T11:00:00Z', score: 75, questionsAnswered: 3, totalQuestions: 3, durationSeconds: 120, passed: true },
  { id: 'rs-5', skillId: 'skill-1', skillName: 'React Component Architecture', date: '2026-01-24T15:00:00Z', score: 85, questionsAnswered: 4, totalQuestions: 4, durationSeconds: 130, passed: true },
  { id: 'rs-6', skillId: 'skill-2', skillName: 'SQL Query Optimization', date: '2026-01-05T08:45:00Z', score: 65, questionsAnswered: 3, totalQuestions: 3, durationSeconds: 155, passed: false },
];
