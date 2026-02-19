import { Routes, Route, Navigate } from "react-router-dom";
import LearnerLayout from "../layouts/LearnerLayout";
import SkillOverview from "../pages/learner/skill/SkillOverview";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/learner" element={<LearnerLayout />}>
        <Route path="skills/:skillId" element={<SkillOverview />} />
      </Route>

      <Route path="*" element={<Navigate to="/learner/skills/skill-4" />} />
    </Routes>
  );
};

export default AppRoutes;
