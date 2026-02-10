import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  variant?: 'default' | 'primary' | 'healthy' | 'warning' | 'critical';
}

const variantStyles = {
  default: 'border-border',
  primary: 'border-primary/20 glow-primary',
  healthy: 'border-healthy/20 glow-healthy',
  warning: 'border-warning/20 glow-warning',
  critical: 'border-critical/20 glow-critical',
};

const iconVariantStyles = {
  default: 'text-muted-foreground bg-muted',
  primary: 'text-primary bg-primary/10',
  healthy: 'text-healthy bg-healthy/10',
  warning: 'text-warning bg-warning/10',
  critical: 'text-critical bg-critical/10',
};

const StatCard = ({ label, value, icon: Icon, trend, variant = 'default' }: StatCardProps) => {
  return (
    <motion.div
      className={`glass-card p-5 ${variantStyles[variant]}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="stat-label">{label}</p>
          <p className="stat-value mt-1">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 font-medium ${trend.positive ? 'text-healthy' : 'text-critical'}`}>
              {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}% from last period
            </p>
          )}
        </div>
        <div className={`p-2.5 rounded-lg ${iconVariantStyles[variant]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
