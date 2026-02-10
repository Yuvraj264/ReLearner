import React from 'react';
import { Outlet } from 'react-router-dom';
import AnimatedBackground from '@/components/AnimatedBackground';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <AnimatedBackground />
      <Outlet />
    </div>
  );
};

export default AuthLayout;
