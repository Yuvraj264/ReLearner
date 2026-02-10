import React, { createContext, useContext, ReactNode } from 'react';
import { analyticsService } from '@/services/analyticsService';
import { AnalyticsData } from '@/data/analytics.mock';

interface AdminContextType {
  analytics: AnalyticsData;
  refreshAnalytics: () => AnalyticsData;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const analytics = analyticsService.getAnalytics();
  const refreshAnalytics = () => analyticsService.getAnalytics();

  return (
    <AdminContext.Provider value={{ analytics, refreshAnalytics }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
};
