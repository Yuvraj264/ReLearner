import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Landing from "@/pages/learner/landing/Landing";
import LearnerLayout from "@/layouts/LearnerLayout";
import AdminLayout from "@/layouts/AdminLayout";
import Onboarding from "@/pages/onboarding/Onboarding";
import LearnerDashboard from "@/pages/learner/dashboard/LearnerDashboard";
import LearnerSkills from "@/pages/learner/skill/LearnerSkills";
import SkillDetail from "@/pages/learner/skill/SkillDetail";
import RecallSessions from "@/pages/learner/recall/RecallSessions";
import RecallQuiz from "@/pages/learner/recall/RecallQuiz";
import AnalyticsDashboard from "@/pages/learner/analytics/AnalyticsDashboard";
import Insights from "@/pages/learner/insights/Insights";
import Notifications from "@/pages/learner/notifications/Notifications";
import LearnerProfile from "@/pages/learner/profile/LearnerProfile";
import AdminDashboard from "@/pages/admin/dashboard/AdminDashboard";
import SkillAnalytics from "@/pages/admin/skill-analytics/SkillAnalytics";
import LearnerActivity from "@/pages/admin/learner-activity/LearnerActivity";
import RetentionEngine from "@/pages/admin/retention-engine/RetentionEngine";
import NotFound from "./pages/NotFound";

import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

import ProtectedRoute from "@/routes/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/learner" element={
              <ProtectedRoute requiredRole="learner">
                <LearnerLayout />
              </ProtectedRoute>
            }>
              <Route index element={<LearnerDashboard />} />
              <Route path="onboarding" element={<Onboarding />} />
              <Route path="dashboard" element={<LearnerDashboard />} />
              <Route path="skills" element={<LearnerSkills />} />
              <Route path="skill/:skillId" element={<SkillDetail />} />
              <Route path="recall" element={<RecallSessions />} />
              <Route path="recall/:skillId" element={<RecallQuiz />} />
              <Route path="analytics" element={<AnalyticsDashboard />} />
              <Route path="insights" element={<Insights />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="profile" element={<LearnerProfile />} />
            </Route>

            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="skill-analytics" element={<SkillAnalytics />} />
              <Route path="learner-activity" element={<LearnerActivity />} />
              <Route path="retention-engine" element={<RetentionEngine />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
