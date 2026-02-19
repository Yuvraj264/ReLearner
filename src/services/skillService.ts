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

export const fetchSkills = async (): Promise<Skill[]> => {
  try {
    const token = localStorage.getItem('token');
    // Check if token exists and is plausible length (JWTs are long, "learner" is short)
    if (!token || token.length < 50) {
      console.log("No valid token found. Using mock data.");
      return mockSkills;
    }

    const res = await fetch(`${API_URL}/skills`, {
      headers: authHeader(),
    });
    if (!res.ok) throw new Error('Failed to fetch skills');
    return await res.json();
  } catch (error) {
    // If API fails (e.g., 401 Unauthorized), fall back to mock data
    console.warn("API unavailable or unauthorized. Falling back to mock data.");
    return mockSkills;
  }
};

export const completeModuleAPI = async (skillId: string, moduleId: string) => {
  const token = localStorage.getItem('token');
  if (!token || token.length < 50) {
    console.warn("API unavailable or unauthorized. Cannot complete module.");
    return; // Or handle as needed for offline mode
  }

  const res = await fetch(`${API_URL}/skills/${skillId}/module`, {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify({ moduleId }),
  });
  if (!res.ok) throw new Error('Failed to complete module');
  return await res.json();
};

export const completeAssessmentAPI = async (skillId: string) => {
  const token = localStorage.getItem('token');
  if (!token || token.length < 50) {
    console.warn("API unavailable or unauthorized. Cannot complete assessment.");
    return;
  }

  const res = await fetch(`${API_URL}/skills/${skillId}/assessment`, {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error('Failed to complete assessment');
  return await res.json();
};
