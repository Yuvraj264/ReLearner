import { Routes, Route } from "react-router-dom";
import LearnerLayout from "../layouts/LearnerLayout";
import SkillOverview from "../pages/learner/skill/SkillOverview";
import RecallSession from "../pages/learner/recall/RecallSession";

const LearnerRoutes = () => (
  <Routes>
    <Route element={<LearnerLayout />}>
      <Route path="skills/:skillId" element={<SkillOverview />} />
      <Route path="recall/:skillId" element={<RecallSession />} />
    </Route>
  </Routes>
);

export default LearnerRoutes;
