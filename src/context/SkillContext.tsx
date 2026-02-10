import React, { createContext, useContext, ReactNode } from 'react';
import { Skill } from '@/data/skills.mock';
import { skillService } from '@/services/skillService';

interface SkillContextType {
  allSkills: Skill[];
  getSkill: (id: string) => Skill | undefined;
  enrollInSkill: (id: string) => void;
  completeModule: (skillId: string, moduleId: string) => void;
  getHealthySkills: () => Skill[];
  getAtRiskSkills: () => Skill[];
  getCriticalSkills: () => Skill[];
}

const SkillContext = createContext<SkillContextType | undefined>(undefined);

export const SkillProvider = ({ children }: { children: ReactNode }) => {
  const value: SkillContextType = {
    allSkills: skillService.getAllSkills(),
    getSkill: skillService.getSkillById,
    enrollInSkill: skillService.enrollInSkill,
    completeModule: skillService.completeModule,
    getHealthySkills: () => skillService.getSkillsByHealth('healthy'),
    getAtRiskSkills: () => skillService.getSkillsByHealth('at_risk'),
    getCriticalSkills: () => skillService.getSkillsByHealth('critical'),
  };

  return (
    <SkillContext.Provider value={value}>
      {children}
    </SkillContext.Provider>
  );
};

export const useSkills = () => {
  const context = useContext(SkillContext);
  if (!context) throw new Error('useSkills must be used within SkillProvider');
  return context;
};
