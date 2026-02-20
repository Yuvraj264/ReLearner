import React, { useState } from 'react';
import { LayoutDashboard, BarChart3, Users, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import SidebarNavItem from '@/components/sidebar/SidebarNavItem';
import { motion } from 'framer-motion';

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.aside
      className="hidden lg:flex flex-col border-r border-border/50 py-4 px-3 bg-background/80 backdrop-blur-xl relative z-40"
      initial={{ width: 224 }}
      animate={{ width: isCollapsed ? 80 : 224 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-end'} mb-6 px-1`}>
        <motion.button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground border border-transparent hover:border-white/10 relative z-50 group"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!isCollapsed}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5 group-hover:text-primary transition-colors" /> : <ChevronLeft className="w-5 h-5 group-hover:text-primary transition-colors" />}
        </motion.button>
      </div>

      <nav className={`space-y-2 flex-1 overflow-x-hidden ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
        <SidebarNavItem to="/admin/dashboard" label="Dashboard" icon={LayoutDashboard} isCollapsed={isCollapsed} />
        <SidebarNavItem to="/admin/skill-analytics" label="Skill Analytics" icon={BarChart3} isCollapsed={isCollapsed} />
        <SidebarNavItem to="/admin/learner-activity" label="Learner Activity" icon={Users} isCollapsed={isCollapsed} />
        <SidebarNavItem to="/admin/retention-engine" label="Retention Engine" icon={Settings} isCollapsed={isCollapsed} />
      </nav>
    </motion.aside>
  );
};

export default AdminSidebar;
