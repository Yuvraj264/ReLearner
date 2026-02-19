import { createContext, useContext, useEffect, useState } from "react";
import {
  fetchSkills,
  completeModuleAPI,
  completeAssessmentAPI
} from "@/services/skillService";

export type LearnerContextType = {
  skills: any[];
  completeModule: (skillId: string, moduleId: string) => Promise<void>;
  completeAssessment: (skillId: string) => Promise<void>;
};

const LearnerContext = createContext<LearnerContextType | null>(null);

export const LearnerProvider = ({ children }: { children: React.ReactNode }) => {
  const [skills, setSkills] = useState<any[]>([]);

  useEffect(() => {
    fetchSkills().then(setSkills).catch(() => setSkills([]));
  }, []);

  const completeModule = async (skillId: string, moduleId: string) => {
    const updated = await completeModuleAPI(skillId, moduleId);
    setSkills(prev =>
      prev.map(skill =>
        skill._id === updated._id ? updated : skill
      )
    );
  };

  const completeAssessment = async (skillId: string) => {
    const updated = await completeAssessmentAPI(skillId);
    setSkills(prev =>
      prev.map(skill =>
        skill._id === updated._id ? updated : skill
      )
    );
  };

  return (
    <LearnerContext.Provider
      value={{
        skills,
        completeModule,
        completeAssessment
      }}
    >
      {children}
    </LearnerContext.Provider>
  );
};

export const useLearner = () => {
  const context = useContext(LearnerContext);
  if (!context) {
    throw new Error("useLearner must be used within LearnerProvider");
  }
  return context;
};
