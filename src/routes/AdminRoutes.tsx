import React from 'react';
import { Route } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import AdminDashboard from '@/pages/admin/dashboard/AdminDashboard';
import SkillAnalytics from '@/pages/admin/skill-analytics/SkillAnalytics';
import LearnerActivity from '@/pages/admin/learner-activity/LearnerActivity';
import RetentionEngine from '@/pages/admin/retention-engine/RetentionEngine';

const AdminRoutes = () => (
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<AdminDashboard />} />
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="skill-analytics" element={<SkillAnalytics />} />
    <Route path="learner-activity" element={<LearnerActivity />} />
    <Route path="retention-engine" element={<RetentionEngine />} />
  </Route>
);

export default AdminRoutes;
