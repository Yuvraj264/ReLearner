import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  variant?: 'default' | 'subtle';
}

const AnimatedBackground = ({ variant = 'default' }: AnimatedBackgroundProps) => {
  return (
    <div className="animated-bg" aria-hidden="true">
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 500,
          height: 500,
          background: 'radial-gradient(circle, hsl(192 85% 48% / 0.06), transparent 70%)',
          top: '10%',
          right: '5%',
        }}
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, hsl(210 80% 55% / 0.05), transparent 70%)',
          bottom: '15%',
          left: '10%',
        }}
        animate={{
          x: [0, -30, 20, 0],
          y: [0, 20, -30, 0],
          scale: [1, 0.95, 1.05, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      />
      {variant === 'default' && (
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 300,
            height: 300,
            background: 'radial-gradient(circle, hsl(152 58% 42% / 0.04), transparent 70%)',
            top: '50%',
            left: '50%',
          }}
          animate={{
            x: [0, 20, -10, 0],
            y: [0, -20, 10, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', delay: 10 }}
        />
      )}
    </div>
  );
};

export default AnimatedBackground;
