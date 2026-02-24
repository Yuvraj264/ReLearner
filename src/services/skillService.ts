import { mockSkills, Skill } from '@/data/skills.mock';

let skills = [...mockSkills];

export const skillService = {
  getAllSkills: (): Skill[] => skills,

  getSkillById: (id: string): Skill | undefined => skills.find(s => s.id === id),

  getEnrolledSkills: (): Skill[] => skills.filter(s => s.enrolled),

  getLearnedSkills: (): Skill[] => skills.filter(s => s.learned),

  getAvailableSkills: (): Skill[] => skills.filter(s => !s.enrolled),

  enrollInSkill: (id: string): Skill | undefined => {
    skills = skills.map(s => s.id === id ? { ...s, enrolled: true, enrolledDate: new Date().toISOString() } : s);
    return skills.find(s => s.id === id);
  },

  completeModule: (skillId: string, moduleId: string): Skill | undefined => {
    skills = skills.map(s =>
      s.id === skillId
        ? { ...s, modules: s.modules.map(m => m.id === moduleId ? { ...m, completed: true } : m) }
        : s
    );
    return skills.find(s => s.id === skillId);
  },

  markSkillLearned: (id: string): Skill | undefined => {
    const skill = skills.find(s => s.id === id);
    if (!skill) return undefined;
    const allModulesComplete = skill.modules.every(m => m.completed);
    if (!allModulesComplete || !skill.assessmentPassed) return undefined;
    skills = skills.map(s => s.id === id ? { ...s, learned: true, learnedDate: new Date().toISOString(), healthScore: 100 } : s);
    return skills.find(s => s.id === id);
  },

  getSkillsByHealth: (status: string): Skill[] => {
    return skills.filter(s => {
      if (!s.learned) return false;
      if (status === 'healthy') return s.healthScore >= 70;
      if (status === 'at_risk') return s.healthScore >= 40 && s.healthScore < 70;
      if (status === 'critical') return s.healthScore < 40;
      return false;
    });
  },

  getDueRecalls: (): Skill[] => {
    const now = new Date();
    return skills.filter(s => s.learned && s.nextRecallDate && new Date(s.nextRecallDate) <= now);
  },
};

// API Integration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
};

const mapBackendSkillToFrontend = (s: any) => ({
  id: s._id,
  _id: s._id,
  name: s.title,
  title: s.title,
  category: "General",
  status: s.status,
  healthScore: s.retention?.health || 0,
  lastRecallDate: s.retention?.lastReviewed || new Date().toISOString(),
  nextRecallDate: s.retention?.nextRecall || new Date().toISOString(),
  enrolled: true,
  learned: s.status === 'completed',
  assessmentPassed: s.status === 'completed',
  modules: s.modules?.map((m: any) => ({
    id: m._id || m.id || Math.random().toString(),
    _id: m._id,
    title: m.title,
    completed: m.completed
  })) || [],
  tags: [],
  decayRate: s.retention?.decayRate || 0.1,
  criticalThreshold: s.retention?.criticalThreshold || 40,
  volatilityIndex: s.retention?.volatilityIndex || 1.0,
  predictedRetention: s.retention?.health || 0,
  completedModules: s.completedModules || 0,
  totalModules: s.totalModules || 0,
  ...s
});

export const fetchSkills = async (): Promise<Skill[]> => {
  try {
    const token = localStorage.getItem('token');
    if (!token || token.length < 50) {
      console.warn("API token missing or invalid. Falling back to mock data.");
      return mockSkills.map(s => ({ ...s, _id: s.id })) as unknown as Skill[];
    }

    const res = await fetch(`${API_URL}/skills`, {
      headers: authHeader(),
    });

    if (!res.ok) throw new Error('Failed to fetch skills');

    const data = await res.json();
    return data.map(mapBackendSkillToFrontend);

  } catch (error) {
    console.warn("API Error. Falling back to mock data.", error);
    return mockSkills.map(s => ({ ...s, _id: s.id })) as unknown as Skill[];
  }
};

export const completeModuleAPI = async (skillId: string, moduleId: string) => {
  const token = localStorage.getItem('token');
  if (!token || token.length < 50) throw new Error('Not authenticated');

  const res = await fetch(`${API_URL}/skills/${skillId}/module`, {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify({ moduleId }),
  });
  if (!res.ok) throw new Error('Failed to complete module');
  const data = await res.json();
  return mapBackendSkillToFrontend(data);
};

export const completeAssessmentAPI = async (skillId: string) => {
  const token = localStorage.getItem('token');
  if (!token || token.length < 50) throw new Error('Not authenticated');

  const res = await fetch(`${API_URL}/skills/${skillId}/assessment`, {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error('Failed to complete assessment');
  const data = await res.json();
  return mapBackendSkillToFrontend(data);
};
