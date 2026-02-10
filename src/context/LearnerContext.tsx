import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Skill, mockSkills } from '@/data/skills.mock';
import { skillService } from '@/services/skillService';

interface LearnerContextType {
  enrolledSkills: Skill[];
  learnedSkills: Skill[];
  dueRecalls: Skill[];
  refreshData: () => void;
}

const LearnerContext = createContext<LearnerContextType | undefined>(undefined);

export const LearnerProvider = ({ children }: { children: ReactNode }) => {
  const [, setTick] = useState(0);
  const refreshData = () => setTick(t => t + 1);

  const enrolledSkills = skillService.getEnrolledSkills();
  const learnedSkills = skillService.getLearnedSkills();
  const dueRecalls = skillService.getDueRecalls();

  return (
    <LearnerContext.Provider value={{ enrolledSkills, learnedSkills, dueRecalls, refreshData }}>
      {children}
    </LearnerContext.Provider>
  );
};

export const useLearner = () => {
  const context = useContext(LearnerContext);
  if (!context) throw new Error('useLearner must be used within LearnerProvider');
  return context;
};
