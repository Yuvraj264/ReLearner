import React, { useState } from 'react';
import { LayoutDashboard, Target, RefreshCw, Bell, UserCircle, Zap, Activity, Brain, ChevronLeft, ChevronRight } from 'lucide-react';
import SidebarNavItem from '@/components/sidebar/SidebarNavItem';
import { motion, AnimatePresence } from 'framer-motion';

const LearnerSidebar = () => {
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
        <SidebarNavItem to="/learner/dashboard" label="Dashboard" icon={LayoutDashboard} isCollapsed={isCollapsed} />
        <SidebarNavItem to="/learner/skills" label="My Skills" icon={Target} isCollapsed={isCollapsed} />
        <SidebarNavItem to="/learner/recall" label="Recall Sessions" icon={RefreshCw} isCollapsed={isCollapsed} />
        <SidebarNavItem to="/learner/insights" label="Neural Insights" icon={Brain} isCollapsed={isCollapsed} />
        <SidebarNavItem to="/learner/analytics" label="Analytics" icon={Activity} isCollapsed={isCollapsed} />
        <SidebarNavItem to="/learner/notifications" label="Notifications" icon={Bell} isCollapsed={isCollapsed} />
        <SidebarNavItem to="/learner/profile" label="Profile" icon={UserCircle} isCollapsed={isCollapsed} />
      </nav>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-4 rounded-xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-center gap-2 mb-2 relative z-10">
                <div className="p-1.5 rounded-md bg-primary/20 text-primary">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-foreground tracking-wide">Retention Engine</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed relative z-10">
                Active — monitoring your skill health and scheduling recalls automatically.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
};

export default LearnerSidebar;
