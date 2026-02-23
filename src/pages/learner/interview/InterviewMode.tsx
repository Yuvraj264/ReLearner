import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Clock, BrainCircuit, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import PageTransition from '@/components/PageTransition';
import { skillService } from '@/services/skillService';

const INTERVIEW_TIME = 60; // 60 seconds per question

interface InterviewQuestion {
    id: string;
    skillName: string;
    category: string;
    difficulty: 'Hard' | 'Extreme' | 'Medium';
    question: string;
    expectedConcepts: string[];
}

const InterviewMode = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(INTERVIEW_TIME);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [confidence, setConfidence] = useState([50]);
    const [isFinished, setIsFinished] = useState(false);

    // Initialize with some tough questions based on learned skills
    useEffect(() => {
        const allSkills = skillService.getLearnedSkills();
        const hardQuestions: InterviewQuestion[] = allSkills.flatMap(skill => {
            // Generate mock tough questions based on the skill
            return skill.recallQuestions.map(q => ({
                id: q.id,
                skillName: skill.name,
                category: skill.category,
                difficulty: (Math.random() > 0.5 ? 'Extreme' : 'Hard') as 'Extreme' | 'Hard',
                question: `In a production environment, how would you approach: ${q.question}`,
                expectedConcepts: [q.options[q.correctIndex], 'Scalability', 'Fault Tolerance']
            }));
        }).sort(() => 0.5 - Math.random()).slice(0, 5); // Take 5 random questions

        // Fallback if no skills
        if (hardQuestions.length === 0) {
            hardQuestions.push(
                { id: '1', skillName: 'System Architecture', category: 'Backend', difficulty: 'Extreme', question: 'Design a globally distributed rate limiter that handles 10M requests per second.', expectedConcepts: ['Redis', 'Hash Ring', 'Eventual Consistency'] },
                { id: '2', skillName: 'React Performance', category: 'Frontend', difficulty: 'Hard', question: 'How do you diagnose and fix a memory leak in a large React SPA caused by stale closures?', expectedConcepts: ['Heap Snapshot', 'useEffect Cleanup', 'useRef'] }
            );
        }

        setQuestions(hardQuestions);
    }, []);

    // Timer logic
    useEffect(() => {
        if (hasAnswered || isFinished || questions.length === 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setHasAnswered(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentIndex, hasAnswered, isFinished, questions]);

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setTimeLeft(INTERVIEW_TIME);
            setHasAnswered(false);
            setConfidence([50]);
        } else {
            setIsFinished(true);
        }
    };

    const handleExit = () => {
        navigate('/learner/dashboard');
    };

    if (questions.length === 0) return null;

    const currentQuestion = questions[currentIndex];
    const isTimeLow = timeLeft <= 15 && !hasAnswered;

    if (isFinished) {
        return (
            <PageTransition>
                <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="max-w-md w-full glass-card p-10 flex flex-col items-center shadow-glow-primary"
                    >
                        <div className="w-20 h-20 rounded-full bg-healthy/20 flex items-center justify-center text-healthy mb-6">
                            <CheckCircle2 size={40} />
                        </div>
                        <h2 className="text-3xl font-bold text-foreground mb-4">Simulation Complete</h2>
                        <p className="text-muted-foreground mb-8">You handled the pressure well. Your confidence ratings have been logged for the retention engine to analyze.</p>
                        <button onClick={handleExit} className="btn-glow bg-primary text-primary-foreground w-full py-4 rounded-xl font-bold text-lg">
                            Return to Dashboard
                        </button>
                    </motion.div>
                </div>
            </PageTransition>
        )
    }

    return (
        <PageTransition>
            <div className="min-h-[85vh] flex flex-col max-w-4xl mx-auto px-4 py-6 relative">

                {/* Top Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 tracking-tight">
                            <BrainCircuit className="text-primary w-6 h-6" />
                            Interview Simulation Mode
                        </h1>
                        <p className="text-sm text-critical/80 mt-1 flex items-center gap-1.5 uppercase tracking-widest font-semibold">
                            <AlertTriangle size={14} /> High-Pressure Environment
                        </p>
                    </div>
                    <button
                        onClick={handleExit}
                        className="w-10 h-10 rounded-full bg-white/5 hover:bg-critical/20 hover:text-critical flex items-center justify-center transition-colors border border-white/10 text-muted-foreground"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Center Content */}
                <div className="flex-1 flex flex-col justify-center items-center py-10 w-full relative">

                    {/* Background ambient glow based on time */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-radial-gradient from-${isTimeLow ? 'critical' : 'primary'}/5 to-transparent blur-3xl -z-10 transition-colors duration-1000 rounded-[100%] pointer-events-none`}></div>

                    {/* Timer */}
                    <AnimatePresence mode="popLayout">
                        {!hasAnswered && (
                            <motion.div
                                key="timer"
                                initial={{ scale: 1.1, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className={`text-7xl md:text-9xl font-black font-mono tracking-tighter mb-12 drop-shadow-2xl flex items-center justify-center tabular-nums transition-colors duration-300 ${isTimeLow ? 'text-critical animate-pulse shadow-[0_0_50px_hsl(var(--critical))]' : 'text-primary'}`}
                            >
                                {timeLeft}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Question Card */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ x: 50, opacity: 0, filter: 'blur(10px)' }}
                            animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
                            exit={{ x: -50, opacity: 0, filter: 'blur(10px)' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className={`w-full glass-card p-8 md:p-12 border ${isTimeLow ? 'border-critical/30 shadow-[0_0_30px_hsl(var(--critical)/0.1)]' : 'border-white/10'}`}
                        >
                            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-secondary/80 text-foreground text-xs font-bold uppercase tracking-wider rounded border border-white/5">
                                        {currentQuestion.category}
                                    </span>
                                    <span className="text-foreground/80 font-medium font-mono text-sm border-b border-foreground/20 pb-0.5">
                                        {currentQuestion.skillName}
                                    </span>
                                </div>
                                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 border backdrop-blur-md ${currentQuestion.difficulty === 'Extreme' ? 'bg-critical/10 text-critical border-critical/30' : 'bg-warning/10 text-warning border-warning/30'}`}>
                                    <ShieldAlert size={14} />
                                    {currentQuestion.difficulty}
                                </div>
                            </div>

                            <h3 className="text-2xl md:text-3xl font-medium text-foreground leading-relaxed mb-8">
                                {currentQuestion.question}
                            </h3>

                            {/* Actions / Answers */}
                            <AnimatePresence mode="wait">
                                {!hasAnswered ? (
                                    <motion.div
                                        key="answering"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex justify-center mt-10"
                                    >
                                        <button
                                            onClick={() => setHasAnswered(true)}
                                            className="btn-glow bg-primary text-primary-foreground px-12 py-4 rounded-xl font-bold text-lg w-full md:w-auto shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                                        >
                                            Finish Answer
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="confidence"
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className="space-y-8 mt-4 pt-8 border-t border-white/10"
                                    >
                                        <div className="space-y-3">
                                            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">Did you hit these concepts?</p>
                                            <div className="flex flex-wrap gap-2">
                                                {currentQuestion.expectedConcepts.map((concept, i) => (
                                                    <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-md text-sm text-foreground/80">
                                                        {concept}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-black/20 p-6 rounded-xl border border-white/5">
                                            <div className="flex justify-between items-center mb-6">
                                                <label className="text-lg font-bold text-foreground">Self-Assess Confidence</label>
                                                <span className="text-2xl font-black font-mono text-primary">{confidence[0]}%</span>
                                            </div>
                                            <Slider
                                                defaultValue={[50]}
                                                max={100}
                                                step={5}
                                                value={confidence}
                                                onValueChange={setConfidence}
                                                className="py-4"
                                            />
                                            <div className="flex justify-between text-xs text-muted-foreground font-semibold uppercase mt-2">
                                                <span>Blanked out</span>
                                                <span className="text-healthy">Aced it</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleNext}
                                            className="w-full btn-glow bg-white text-black hover:bg-neutral-200 px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
                                        >
                                            Next Scenario <ArrowRight size={20} />
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Bottom Progress */}
                <div className="mt-auto space-y-3 relative z-10 w-full">
                    <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        <span>Simulated Pressure Test</span>
                        <span className="text-foreground">Scenario {currentIndex + 1} of {questions.length}</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-primary"
                            initial={{ width: `${(currentIndex / questions.length) * 100}%` }}
                            animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default InterviewMode;
