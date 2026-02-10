import { mockRecallSessions, RecallSession } from '@/data/recall.mock';

let sessions = [...mockRecallSessions];

export const recallService = {
  getRecallSessions: (): RecallSession[] => sessions,

  getSessionsBySkill: (skillId: string): RecallSession[] =>
    sessions.filter(s => s.skillId === skillId),

  getRecentSessions: (limit: number = 5): RecallSession[] =>
    [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, limit),

  submitRecallSession: (session: Omit<RecallSession, 'id'>): RecallSession => {
    const newSession = { ...session, id: `rs-${Date.now()}` };
    sessions = [newSession, ...sessions];
    return newSession;
  },

  getRecallStats: () => {
    const total = sessions.length;
    const passed = sessions.filter(s => s.passed).length;
    const avgScore = total > 0 ? Math.round(sessions.reduce((sum, s) => sum + s.score, 0) / total) : 0;
    return { total, passed, failed: total - passed, avgScore, passRate: total > 0 ? Math.round((passed / total) * 100) : 0 };
  },
};
