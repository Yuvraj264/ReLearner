import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/navbar/Navbar';
import LearnerSidebar from '@/components/sidebar/LearnerSidebar';
import AnimatedBackground from '@/components/AnimatedBackground';
import { LearnerProvider } from '@/context/LearnerContext';
import { SkillProvider } from '@/context/SkillContext';

const LearnerLayout = () => {
  return (
    <LearnerProvider>
      <SkillProvider>
        <div className="min-h-screen flex flex-col">
          <AnimatedBackground variant="subtle" />
          <Navbar />
          <div className="flex flex-1 overflow-hidden">
            <LearnerSidebar />
            <main className="flex-1 overflow-y-auto p-6">
              <Outlet />
            </main>
          </div>
        </div>
      </SkillProvider>
    </LearnerProvider>
  );
};

export default LearnerLayout;
