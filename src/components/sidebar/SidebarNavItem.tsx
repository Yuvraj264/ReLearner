import React from 'react';
import { NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface SidebarNavItemProps {
  to: string;
  label: string;
  icon: LucideIcon;
}

const SidebarNavItem = ({ to, label, icon: Icon }: SidebarNavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(to + '/');

  return (
    <RouterNavLink to={to} className="block">
      <motion.div
        className={`nav-link flex items-center gap-3 ${isActive ? 'active' : ''}`}
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.98 }}
      >
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span>{label}</span>
        {isActive && (
          <motion.div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full"
            layoutId="sidebar-indicator"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
      </motion.div>
    </RouterNavLink>
  );
};

export default SidebarNavItem;
