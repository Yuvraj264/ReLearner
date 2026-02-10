import React from 'react';
import { Route } from 'react-router-dom';
import LearnerLayout from '@/layouts/LearnerLayout';
import LearnerDashboard from '@/pages/learner/dashboard/LearnerDashboard';
import LearnerSkills from '@/pages/learner/skill/LearnerSkills';
import SkillDetail from '@/pages/learner/skill/SkillDetail';
import RecallSessions from '@/pages/learner/recall/RecallSessions';
import RecallQuiz from '@/pages/learner/recall/RecallQuiz';
import Notifications from '@/pages/learner/notifications/Notifications';
import LearnerProfile from '@/pages/learner/profile/LearnerProfile';

const LearnerRoutes = () => (
  <Route path="/learner" element={<LearnerLayout />}>
    <Route index element={<LearnerDashboard />} />
    <Route path="dashboard" element={<LearnerDashboard />} />
    <Route path="skills" element={<LearnerSkills />} />
    <Route path="skill/:skillId" element={<SkillDetail />} />
    <Route path="recall" element={<RecallSessions />} />
    <Route path="recall/:skillId" element={<RecallQuiz />} />
    <Route path="notifications" element={<Notifications />} />
    <Route path="profile" element={<LearnerProfile />} />
  </Route>
);

export default LearnerRoutes;
