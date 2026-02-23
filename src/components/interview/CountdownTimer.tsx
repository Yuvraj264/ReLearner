import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const useCountdown = (totalMinutes: number, onTimeUp?: () => void, isPaused: boolean = false) => {
    const [timeLeft, setTimeLeft] = useState(totalMinutes * 60);
    const onTimeUpRef = useRef(onTimeUp);

    // Keep callback ref fresh to avoid closure staleness without re-triggering effect
    useEffect(() => {
        onTimeUpRef.current = onTimeUp;
    }, [onTimeUp]);

    useEffect(() => {
        if (timeLeft <= 0 || isPaused) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onTimeUpRef.current?.();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, isPaused]);

    return timeLeft;
};

interface CountdownTimerProps {
    totalDuration: number; // in minutes
    onTimeUp?: () => void;
    isPaused?: boolean;
    onCriticalChange?: (isCritical: boolean) => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
    totalDuration,
    onTimeUp,
    isPaused = false,
    onCriticalChange
}) => {
    const timeLeft = useCountdown(totalDuration, onTimeUp, isPaused);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const isCritical = timeLeft > 0 && timeLeft <= 5 * 60; // Red under 5 mins
    const isWarning = timeLeft > 5 * 60 && timeLeft <= Math.max(10 * 60, totalDuration * 60 * 0.5); // Yellow

    useEffect(() => {
        onCriticalChange?.(isCritical);
    }, [isCritical, onCriticalChange]);

    let colorClass = 'text-healthy shadow-[0_0_20px_hsl(var(--healthy)/0.1)]';
    if (isCritical) {
        colorClass = 'text-critical shadow-[0_0_50px_hsl(var(--critical))]';
    } else if (isWarning) {
        colorClass = 'text-warning shadow-[0_0_30px_hsl(var(--warning)/0.3)]';
    }

    return (
        <motion.div
            className={`text-6xl sm:text-7xl md:text-9xl font-black font-mono tracking-tighter mb-12 drop-shadow-2xl flex items-center justify-center tabular-nums transition-colors duration-1000 ${colorClass}`}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
        >
            <motion.span
                animate={isCritical ? { scale: [1, 1.02, 1], opacity: [1, 0.8, 1] } : {}}
                transition={isCritical ? { duration: 1, repeat: Infinity, ease: 'easeInOut' } : {}}
            >
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </motion.span>
        </motion.div>
    );
};

export default CountdownTimer;
