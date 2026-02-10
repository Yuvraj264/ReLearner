import React from 'react';
import { motion } from 'framer-motion';
import { Bell, RefreshCw, AlertTriangle, Award, MessageSquare } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import EmptyState from '@/components/empty-states/EmptyState';
import { notificationService, Notification } from '@/services/notificationService';
import { formatRelativeDate } from '@/utils/dateUtils';

const iconMap = {
  recall_due: RefreshCw,
  skill_decay: AlertTriangle,
  achievement: Award,
  reminder: MessageSquare,
};

const iconColorMap = {
  recall_due: 'text-warning bg-warning/10',
  skill_decay: 'text-critical bg-critical/10',
  achievement: 'text-healthy bg-healthy/10',
  reminder: 'text-primary bg-primary/10',
};

const Notifications = () => {
  const notifications = notificationService.getNotifications();

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
            <p className="text-sm text-muted-foreground mt-1">Stay on top of your skill retention</p>
          </div>
          <button
            onClick={() => notificationService.markAllRead()}
            className="text-xs text-primary hover:underline"
          >
            Mark all read
          </button>
        </div>

        {notifications.length === 0 ? (
          <EmptyState icon={Bell} title="All caught up" description="No new notifications." />
        ) : (
          <div className="space-y-2">
            {notifications.map((n, i) => {
              const Icon = iconMap[n.type];
              return (
                <motion.div
                  key={n.id}
                  className={`glass-card p-4 flex items-start gap-3 ${!n.read ? 'border-primary/20' : ''}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className={`p-2 rounded-lg flex-shrink-0 ${iconColorMap[n.type]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={`text-sm font-medium ${!n.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {n.title}
                      </h3>
                      {!n.read && <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">{formatRelativeDate(n.date)}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Notifications;
