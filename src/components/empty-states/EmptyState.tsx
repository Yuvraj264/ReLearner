import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

const EmptyState = ({ icon: Icon = Inbox, title, description, action }: EmptyStateProps) => (
  <motion.div
    className="flex flex-col items-center justify-center py-16 px-6 text-center"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
  >
    <div className="p-4 rounded-2xl bg-muted/50 mb-4">
      <Icon className="w-8 h-8 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
    <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
    {action && (
      <button
        onClick={action.onClick}
        className="mt-4 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg btn-glow transition-colors"
      >
        {action.label}
      </button>
    )}
  </motion.div>
);

export default EmptyState;
