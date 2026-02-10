import React from 'react';
import { motion } from 'framer-motion';

const LoaderSpinner = () => (
  <div className="flex items-center justify-center p-12">
    <motion.div
      className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  </div>
);

const LoaderSkeleton = ({ lines = 3 }: { lines?: number }) => (
  <div className="space-y-3 p-4">
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="h-4 bg-muted rounded-md animate-shimmer"
        style={{
          width: `${80 - i * 15}%`,
          backgroundImage: 'linear-gradient(90deg, transparent 0%, hsl(var(--accent)) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
        }}
      />
    ))}
  </div>
);

export { LoaderSpinner, LoaderSkeleton };
