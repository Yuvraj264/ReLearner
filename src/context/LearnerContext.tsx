import { createContext, useContext, useEffect, useState } from "react";
import {
  fetchSkills,
  completeModuleAPI,
  completeAssessmentAPI
} from "@/services/skillService";

export type LearnerContextType = {
  skills: any[];
  loading: boolean;
  completeModule: (skillId: string, moduleId: string) => Promise<void>;
  completeAssessment: (skillId: string) => Promise<void>;
};

const LearnerContext = createContext<LearnerContextType | null>(null);

export const LearnerProvider = ({ children }: { children: React.ReactNode }) => {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills()
      .then(setSkills)
      .catch(() => setSkills([]))
      .finally(() => setLoading(false));
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
        loading,
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
