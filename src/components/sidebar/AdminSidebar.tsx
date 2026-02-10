import React from 'react';
import { LayoutDashboard, BarChart3, Users, Settings } from 'lucide-react';
import SidebarNavItem from '@/components/sidebar/SidebarNavItem';

const AdminSidebar = () => {
  return (
    <aside className="hidden lg:flex flex-col w-56 border-r border-border/50 py-4 px-3" style={{ background: 'hsl(228 20% 5% / 0.5)' }}>
      <nav className="space-y-1 flex-1">
        <SidebarNavItem to="/admin/dashboard" label="Dashboard" icon={LayoutDashboard} />
        <SidebarNavItem to="/admin/skill-analytics" label="Skill Analytics" icon={BarChart3} />
        <SidebarNavItem to="/admin/learner-activity" label="Learner Activity" icon={Users} />
        <SidebarNavItem to="/admin/retention-engine" label="Retention Engine" icon={Settings} />
      </nav>
    </aside>
  );
};

export default AdminSidebar;
