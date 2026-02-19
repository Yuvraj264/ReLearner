import { createContext, useContext, useEffect, useState } from "react";
import {
  fetchSkills,
  completeModuleAPI,
  completeAssessmentAPI
} from "../services/skillService";
import { submitRecallAPI } from "../services/recallService";

const SkillContext = createContext();

export const SkillProvider = ({ children }) => {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    fetchSkills().then(setSkills).catch(() => setSkills([]));
  }, []);

  const completeModule = async (skillId, moduleId) => {
    const updated = await completeModuleAPI(skillId, moduleId);
    setSkills(prev => prev.map(s => (s._id === updated._id ? updated : s)));
  };

  const completeAssessment = async skillId => {
    const updated = await completeAssessmentAPI(skillId);
    setSkills(prev => prev.map(s => (s._id === updated._id ? updated : s)));
  };

  const completeRecall = async (skillId, score = 1) => {
    const updated = await submitRecallAPI(skillId, score);
    setSkills(prev => prev.map(s => (s._id === updated._id ? updated : s)));
  };

  return (
    <SkillContext.Provider
      value={{ skills, completeModule, completeAssessment, completeRecall }}
    >
      {children}
    </SkillContext.Provider>
  );
};

export const useSkills = () => useContext(SkillContext);
