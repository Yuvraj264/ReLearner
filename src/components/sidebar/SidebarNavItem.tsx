import React from 'react';
import { NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface SidebarNavItemProps {
  to: string;
  label: string;
  icon: LucideIcon;
  isCollapsed?: boolean;
}

const SidebarNavItem = ({ to, label, icon: Icon, isCollapsed = false }: SidebarNavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(to + '/');

  return (
    <RouterNavLink to={to} className="block relative group" aria-label={isCollapsed ? label : undefined}>
      <motion.div
        className={`nav-link flex items-center relative ${isActive ? 'active' : ''} ${isCollapsed ? 'justify-center w-10 h-10 mx-auto rounded-xl p-0' : 'gap-3 px-3 py-2'}`}
        whileHover={{ x: isCollapsed ? 0 : 2, backgroundColor: 'hsl(var(--muted)/0.5)' }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div whileHover={{ scale: 1.1 }} className="flex-shrink-0 flex items-center justify-center">
          <Icon className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'} transition-all`} />
        </motion.div>

        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="whitespace-nowrap overflow-hidden origin-left"
          >
            {label}
          </motion.span>
        )}

        {isCollapsed && (
          <div className="absolute left-full ml-4 px-2 py-1 bg-popover text-popover-foreground text-sm rounded shadow-lg border border-border/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
            {label}
          </div>
        )}

        {isActive && (
          <motion.div
            className={`absolute ${isCollapsed ? 'left-0' : 'left-0'} top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-r-full shadow-[0_0_8px_hsl(var(--primary)/0.5)]`}
            layoutId="sidebar-indicator"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
      </motion.div>
    </RouterNavLink>
  );
};

export default SidebarNavItem;
