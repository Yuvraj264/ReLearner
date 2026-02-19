import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';

interface CognitiveStabilityProps {
    score: number;
}

const CognitiveStability: React.FC<CognitiveStabilityProps> = ({ score }) => {
    const [displayScore, setDisplayScore] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setDisplayScore(score), 500);
        return () => clearTimeout(timer);
    }, [score]);

    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    const statusColor = score >= 85 ? 'text-healthy' : score >= 60 ? 'text-primary' : score >= 40 ? 'text-warning' : 'text-critical';
    const strokeColor = score >= 85 ? 'var(--healthy)' : score >= 60 ? 'var(--primary)' : score >= 40 ? 'var(--warning)' : 'var(--critical)';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[220px]"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-30 pointer-events-none" />

            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 z-10 flex items-center gap-2">
                <BrainCircuit size={14} /> Cognitive Stability
            </h3>

            <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Background Circle */}
                <svg className="absolute w-full h-full transform -rotate-90">
                    <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        stroke="hsl(var(--muted))"
                        strokeWidth="8"
                        fill="transparent"
                        className="opacity-20"
                    />
                    <motion.circle
                        cx="80"
                        cy="80"
                        r={radius}
                        stroke={`hsl(${strokeColor})`}
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                    />
                </svg>

                {/* Center Text */}
                <div className="flex flex-col items-center z-10">
                    <motion.span
                        className={`text-4xl font-black tracking-tighter ${statusColor}`}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        {score}%
                    </motion.span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mt-1">
                        Retention
                    </span>
                </div>

                {/* Decorative Ring */}
                <div className="absolute w-full h-full rounded-full border border-white/5 animate-spin-slow pointer-events-none opacity-50"></div>
            </div>

            <div className="mt-2 text-center z-10">
                <p className="text-xs text-muted-foreground">vs. last week <span className="text-healthy font-semibold">+2.4%</span></p>
            </div>
        </motion.div>
    );
};

export default CognitiveStability;
