import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Zap } from 'lucide-react';

interface RecallMomentumProps {
    streak: number;
}

const RecallMomentum: React.FC<RecallMomentumProps> = ({ streak }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 relative overflow-hidden flex flex-col justify-between min-h-[220px]"
        >
            <div className="z-10">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-1">
                    <Zap size={14} /> Recall Momentum
                </h3>
                <p className="text-[10px] text-muted-foreground">Daily consecutive learning</p>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center z-10 relative">
                <motion.div
                    className="relative"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    {/* Fire Base */}
                    <div className={`text-6xl ${streak > 0 ? 'text-warning drop-shadow-[0_0_15px_rgba(255,165,0,0.5)]' : 'text-muted-foreground/20'}`}>
                        🔥
                    </div>

                    {/* Streak Number Overlay */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-2">
                        <span className="text-xl font-black text-background drop-shadow-md">{streak}</span>
                    </div>
                </motion.div>

                {streak > 2 && (
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        initial="hidden"
                        animate="visible"
                    >
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                                animate={{
                                    opacity: [0, 1, 0],
                                    scale: [0, 1.5, 0],
                                    y: -40 - Math.random() * 40,
                                    x: (Math.random() - 0.5) * 40
                                }}
                                transition={{
                                    duration: 1 + Math.random(),
                                    repeat: Infinity,
                                    delay: Math.random() * 2,
                                    ease: "easeOut"
                                }}
                                style={{ left: '50%', top: '60%' }}
                            />
                        ))}
                    </motion.div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4 z-10">
                <div className="bg-background/20 rounded p-2 text-center backdrop-blur-sm">
                    <span className="block text-xs text-muted-foreground">Current</span>
                    <span className="text-lg font-bold text-foreground">{streak} Days</span>
                </div>
                <div className="bg-background/20 rounded p-2 text-center backdrop-blur-sm">
                    <span className="block text-xs text-muted-foreground">Best</span>
                    <span className="text-lg font-bold text-accent-foreground">14 Days</span>
                </div>
            </div>

            {/* Background Glow */}
            <div className="absolute top-10 right-10 w-40 h-40 bg-warning/10 blur-[80px] rounded-full pointer-events-none"></div>
        </motion.div>
    );
};

export default RecallMomentum;
