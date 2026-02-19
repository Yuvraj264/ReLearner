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

// API Integration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
};

export const submitRecallAPI = async (skillId: string, score: number) => {
  const res = await fetch(`${API_URL}/recall/${skillId}`, {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify({ score }),
  });
  if (!res.ok) throw new Error('Failed to submit recall');
  return await res.json();
};

export const generateQuestionsAPI = async (skillName: string, difficulty: string = 'Intermediate') => {
  const res = await fetch(`${API_URL}/recall/generate`, {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify({ skillName, difficulty }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to generate questions');
  }
  return await res.json();
};
