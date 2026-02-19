import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertCircle } from 'lucide-react';

interface RecallCountdownProps {
    nextCriticalDate: Date | string;
}

const RecallCountdown: React.FC<RecallCountdownProps> = ({ nextCriticalDate }) => {
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
        isCritical: boolean;
    } | null>(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = new Date(nextCriticalDate).getTime() - new Date().getTime();

            if (difference > 0) {
                return {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                    isCritical: difference < 24 * 60 * 60 * 1000 // Less than 24 hours
                };
            }
            return null; // Time passed
        };

        // Initial calculation
        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [nextCriticalDate]);

    if (!timeLeft) {
        return (
            <div className="flex items-center gap-2 text-critical font-medium bg-critical/10 px-3 py-1.5 rounded-md border border-critical/20">
                <AlertCircle size={14} />
                <span className="text-xs uppercase tracking-wider">Review Overdue</span>
            </div>
        );
    }

    const { days, hours, minutes, seconds, isCritical } = timeLeft;

    return (
        <motion.div
            className={`glass-card relative overflow-hidden inline-flex items-center gap-4 px-4 py-2 rounded-lg border ${isCritical ? 'border-critical/40 bg-critical/5' : 'border-primary/20 bg-primary/5'
                }`}
            animate={isCritical ? {
                boxShadow: ['0 0 0px rgba(239,68,68,0)', '0 0 10px rgba(239,68,68,0.3)', '0 0 0px rgba(239,68,68,0)']
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
        >
            <div className="flex items-center gap-2 text-muted-foreground border-r border-white/10 pr-3 mr-1">
                <Clock size={16} className={isCritical ? 'text-critical animate-pulse' : 'text-primary'} />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                    {isCritical ? 'Critical In' : 'Recall In'}
                </span>
            </div>

            <div className="flex items-center gap-3 font-mono text-sm font-bold tracking-tight text-foreground">
                {days > 0 && (
                    <div className="flex flex-col items-center leading-none">
                        <span>{String(days).padStart(2, '0')}</span>
                        <span className="text-[8px] text-muted-foreground font-sans font-medium uppercase mt-0.5">Days</span>
                    </div>
                )}

                {days > 0 && <span className="text-muted-foreground/30 -mt-2">:</span>}

                <div className="flex flex-col items-center leading-none">
                    <AnimatePresence mode="popLayout">
                        <motion.span
                            key={hours}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {String(hours).padStart(2, '0')}
                        </motion.span>
                    </AnimatePresence>
                    <span className="text-[8px] text-muted-foreground font-sans font-medium uppercase mt-0.5">Hrs</span>
                </div>

                <span className="text-muted-foreground/30 -mt-2">:</span>

                <div className="flex flex-col items-center leading-none">
                    <AnimatePresence mode="popLayout">
                        <motion.span
                            key={minutes}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {String(minutes).padStart(2, '0')}
                        </motion.span>
                    </AnimatePresence>
                    <span className="text-[8px] text-muted-foreground font-sans font-medium uppercase mt-0.5">Min</span>
                </div>

                <span className="text-muted-foreground/30 -mt-2">:</span>

                <div className="flex flex-col items-center leading-none w-[18px]">
                    <span className={`${isCritical ? 'text-critical' : 'text-primary'}`}>
                        {String(seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[8px] text-muted-foreground font-sans font-medium uppercase mt-0.5">Sec</span>
                </div>
            </div>

            {isCritical && (
                <div className="absolute top-0 right-0 w-1 h-full bg-critical animate-pulse"></div>
            )}
        </motion.div>
    );
};

export default RecallCountdown;
