import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, LogOut, User, Brain } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { notificationService } from '@/services/notificationService';
import { ROLES } from '@/constants/roles';

const Navbar = () => {
  const { user, role, switchRole, logout } = useAuth();
  const navigate = useNavigate();
  const unreadCount = notificationService.getUnreadCount();

  return (
    <header className="sticky top-0 z-50 border-b border-border/50" style={{ background: 'hsl(228 20% 6% / 0.8)', backdropFilter: 'blur(16px)' }}>
      <div className="flex items-center justify-between px-6 h-14">
        <Link to={role === ROLES.ADMIN ? '/admin' : '/learner'} className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <span className="text-base font-bold tracking-tight text-foreground">RetainIQ</span>
        </Link>

        <div className="flex items-center gap-1">
          {/* Portal switcher - Only show for Admins */}
          {user?.role === ROLES.ADMIN ? (
            <div className="flex items-center bg-muted/50 rounded-lg p-0.5 mr-2">
              <button
                onClick={() => { switchRole(ROLES.LEARNER); navigate('/learner'); }}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${role === ROLES.LEARNER ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Learner
              </button>
              <button
                onClick={() => { switchRole(ROLES.ADMIN); navigate('/admin'); }}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${role === ROLES.ADMIN ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Admin
              </button>
            </div>
          ) : null}

          {role === ROLES.LEARNER && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/learner/notifications')}
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-critical rounded-full animate-pulse-glow" />
              )}
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(role === ROLES.LEARNER ? '/learner/profile' : '/admin')}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
          >
            <User className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { logout(); navigate('/'); }}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
          >
            <LogOut className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
