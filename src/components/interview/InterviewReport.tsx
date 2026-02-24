import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Target, TrendingUp, TrendingDown, Clock, BrainCircuit, Activity, RotateCcw } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { calculatePressurePerformance } from '@/utils/performanceMetrics';

export interface InterviewReportProps {
    totalQuestions: number;
    correctAnswers: number;
    averageConfidence: number;
    averageTimePerQuestion: number; // in seconds
    maxTimePerQuestion?: number; // optional, default 600
    strongestSkill: string | null;
    weakestSkill: string | null;
    onRetry: () => void;
    onExit: () => void;
}

const InterviewReport: React.FC<InterviewReportProps> = ({
    totalQuestions,
    correctAnswers,
    averageConfidence,
    averageTimePerQuestion,
    maxTimePerQuestion = 600,
    strongestSkill,
    weakestSkill,
    onRetry,
    onExit
}) => {
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    // Calculate pressure score
    const timeRemainingPercentage = Math.max(0, 1 - (averageTimePerQuestion / maxTimePerQuestion));
    const pressure = calculatePressurePerformance(accuracy, timeRemainingPercentage);

    // Example logic for improvement focus:
    let improvementFocus = "Keep practicing!";
    if (accuracy < 60) improvementFocus = `Core fundamentals need work${weakestSkill ? `, specifically in ${weakestSkill}` : ''}.`;
    else if (averageConfidence < 60) improvementFocus = "Your accuracy is decent, but work on trusting your knowledge. Practice articulating concepts aloud.";
    else if (averageTimePerQuestion > 45) improvementFocus = "You know the material, but speed is lacking. Try timed flashcards.";
    else improvementFocus = "Excellent performance. You are ready for high-pressure situations.";

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
    };

    return (
        <PageTransition>
            <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 w-full max-w-4xl mx-auto">
                <motion.div
                    className="text-center mb-10"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4 border border-primary/20">
                        <Activity className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight mb-3">Simulation Complete</h1>
                    <p className="text-muted-foreground text-lg">Here is your performance breakdown under pressure.</p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mb-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    {/* Main Score Card */}
                    <motion.div variants={itemVariants} className="glass-card p-6 md:p-8 flex flex-col justify-center items-center relative overflow-hidden group border-white/10 md:col-span-1 lg:col-span-1">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50"></div>
                        <Target className="w-10 h-10 text-primary mb-4 opacity-80" />
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">Overall Accuracy</h3>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-6xl font-black tracking-tighter ${accuracy >= 80 ? 'text-healthy' : accuracy >= 50 ? 'text-warning' : 'text-critical'}`}>
                                {accuracy}%
                            </span>
                        </div>
                        <div className="w-full bg-secondary/50 h-2 rounded-full mt-6 overflow-hidden">
                            <motion.div
                                className={`h-full ${accuracy >= 80 ? 'bg-healthy' : accuracy >= 50 ? 'bg-warning' : 'bg-critical'}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${accuracy}%` }}
                                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground mt-3 font-medium">({correctAnswers} of {totalQuestions} scenarios passed)</p>
                    </motion.div>

                    {/* Pressure Performance Card */}
                    <motion.div variants={itemVariants} className="glass-card p-6 md:p-8 flex flex-col justify-center items-center relative overflow-hidden group border-white/10 md:col-span-1 lg:col-span-1">
                        <div className="absolute inset-0 bg-gradient-to-bl from-secondary/10 to-transparent opacity-50"></div>
                        <Activity className="w-10 h-10 text-secondary mb-4 opacity-80" />
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2 text-center">Pressure Rating</h3>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-6xl font-black tracking-tighter ${pressure.score >= 80 ? 'text-healthy' : pressure.score >= 50 ? 'text-warning' : 'text-critical'}`}>
                                {pressure.score}
                            </span>
                        </div>
                        <div className="w-full bg-secondary/50 h-2 rounded-full mt-6 overflow-hidden">
                            <motion.div
                                className={`h-full ${pressure.score >= 80 ? 'bg-healthy' : pressure.score >= 50 ? 'bg-warning' : 'bg-critical'}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${pressure.score}%` }}
                                transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                            />
                        </div>
                        <p className={`text-xs mt-3 font-bold uppercase ${pressure.score >= 80 ? 'text-healthy' : pressure.score >= 50 ? 'text-warning' : 'text-critical'}`}>{pressure.interpretation}</p>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-4 md:col-span-2 lg:col-span-1">
                        {/* Confidence Card */}
                        <motion.div variants={itemVariants} className="glass-card p-6 flex flex-col justify-center items-center border-white/10">
                            <BrainCircuit className="w-6 h-6 text-foreground/50 mb-3" />
                            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 text-center">Avg Confidence</h3>
                            <span className="text-3xl font-bold text-foreground">{Math.round(averageConfidence)}%</span>
                        </motion.div>

                        {/* Time Card */}
                        <motion.div variants={itemVariants} className="glass-card p-6 flex flex-col justify-center items-center border-white/10">
                            <Clock className="w-6 h-6 text-foreground/50 mb-3" />
                            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 text-center">Time / Question</h3>
                            <span className="text-3xl font-bold text-foreground">{Math.round(averageTimePerQuestion)}s</span>
                        </motion.div>

                        {/* Strongest */}
                        <motion.div variants={itemVariants} className="glass-card p-5 flex flex-col justify-center items-center border-white/10 bg-healthy/5 border-healthy/10">
                            <TrendingUp className="w-5 h-5 text-healthy mb-2" />
                            <h3 className="text-[10px] font-bold text-healthy/70 uppercase tracking-widest mb-1 text-center">Strongest Area</h3>
                            <span className="text-sm font-semibold text-foreground text-center line-clamp-2">{strongestSkill || 'N/A'}</span>
                        </motion.div>

                        {/* Weakest */}
                        <motion.div variants={itemVariants} className="glass-card p-5 flex flex-col justify-center items-center border-white/10 bg-critical/5 border-critical/10">
                            <TrendingDown className="w-5 h-5 text-critical mb-2" />
                            <h3 className="text-[10px] font-bold text-critical/70 uppercase tracking-widest mb-1 text-center">Weakest Area</h3>
                            <span className="text-sm font-semibold text-foreground text-center line-clamp-2">{weakestSkill || 'N/A'}</span>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Actionable Feedback */}
                <motion.div
                    className="w-full glass-card border border-primary/20 bg-primary/5 p-6 md:p-8 flex items-start gap-4 mb-8"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <div className="p-2 bg-primary/20 rounded-lg text-primary shrink-0 mt-1">
                        <BrainCircuit size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-foreground mb-2">Neural Analysis</h3>
                        <p className="text-foreground/80 leading-relaxed text-sm md:text-base">
                            {improvementFocus}
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    className="flex flex-col sm:flex-row gap-4 w-full md:w-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <button onClick={onRetry} className="btn-glow bg-secondary text-foreground px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-secondary/80 transition-colors">
                        <RotateCcw size={18} />
                        Run Another Simulation
                    </button>
                    <button onClick={onExit} className="btn-glow bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform">
                        Return to Dashboard
                    </button>
                </motion.div>

            </div>
        </PageTransition>
    );
};

export default InterviewReport;
