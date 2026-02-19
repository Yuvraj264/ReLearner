import React from 'react';
import { LayoutDashboard, Target, RefreshCw, Bell, UserCircle, Zap, Activity, Brain } from 'lucide-react';
import SidebarNavItem from '@/components/sidebar/SidebarNavItem';

const LearnerSidebar = () => {
  return (
    <aside className="hidden lg:flex flex-col w-56 border-r border-border/50 py-4 px-3" style={{ background: 'hsl(228 20% 5% / 0.5)' }}>
      <nav className="space-y-1 flex-1">
        <SidebarNavItem to="/learner/dashboard" label="Dashboard" icon={LayoutDashboard} />
        <SidebarNavItem to="/learner/skills" label="My Skills" icon={Target} />
        <SidebarNavItem to="/learner/recall" label="Recall Sessions" icon={RefreshCw} />
        <SidebarNavItem to="/learner/insights" label="Neural Insights" icon={Brain} />
        <SidebarNavItem to="/learner/analytics" label="Analytics" icon={Activity} />
        <SidebarNavItem to="/learner/notifications" label="Notifications" icon={Bell} />
        <SidebarNavItem to="/learner/profile" label="Profile" icon={UserCircle} />
      </nav>
      <div className="glass-card p-3 mt-4">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-foreground">Retention Engine</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Active — monitoring your skill health and scheduling recalls automatically.
        </p>
      </div>
    </aside>
  );
};

export default LearnerSidebar;
