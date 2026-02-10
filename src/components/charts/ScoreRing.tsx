import React from 'react';
import { motion } from 'framer-motion';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const ScoreRing = ({ score, size = 80, strokeWidth = 6, className = '' }: ScoreRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 70) return 'hsl(152, 58%, 42%)';
    if (s >= 40) return 'hsl(36, 88%, 52%)';
    return 'hsl(0, 68%, 52%)';
  };

  const getTextClass = (s: number) => {
    if (s >= 70) return 'fill-healthy';
    if (s >= 40) return 'fill-warning';
    return 'fill-critical';
  };

  return (
    <div className={`score-ring ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(222, 16%, 16%)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(score)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          className={`text-lg font-bold ${getTextClass(score)}`}
        >
          {score}
        </text>
      </svg>
    </div>
  );
};

export default ScoreRing;
