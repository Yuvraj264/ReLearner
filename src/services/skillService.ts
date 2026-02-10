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
