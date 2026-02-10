import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/navbar/Navbar';
import AdminSidebar from '@/components/sidebar/AdminSidebar';
import AnimatedBackground from '@/components/AnimatedBackground';
import { AdminProvider } from '@/context/AdminContext';

const AdminLayout = () => {
  return (
    <AdminProvider>
      <div className="min-h-screen flex flex-col">
        <AnimatedBackground variant="subtle" />
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <AdminSidebar />
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </AdminProvider>
  );
};

export default AdminLayout;
