import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Zap, Target, Brain, Award, Star, ArrowRight } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { toast } from 'sonner';

// Mock Skills Data
const AVAILABLE_SKILLS = [
    { id: 'react', name: 'React', category: 'Frontend' },
    { id: 'node', name: 'Node.js', category: 'Backend' },
    { id: 'typescript', name: 'TypeScript', category: 'Language' },
    { id: 'python', name: 'Python', category: 'Language' },
    { id: 'design', name: 'UI/UX Design', category: 'Design' },
    { id: 'aws', name: 'AWS', category: 'DevOps' },
    { id: 'sql', name: 'SQL', category: 'Database' },
    { id: 'dsa', name: 'Algorithms', category: 'CS Core' },
];

const GOALS = [
    {
        id: 'maintain',
        title: 'Maintain Current Level',
        desc: 'Keep my skills sharp with periodic reviews.',
        icon: Brain
    },
    {
        id: 'master',
        title: 'Master New Concepts',
        desc: 'Deep dive into advanced topics aggressively.',
        icon: Zap
    },
    {
        id: 'interview',
        title: 'Prepare for Interview',
        desc: 'High-intensity drills for upcoming assessments.',
        icon: Award
    }
];

const Onboarding = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [confidence, setConfidence] = useState<Record<string, number>>({});
    const [goal, setGoal] = useState<string | null>(null);

    const totalSteps = 3;
    const progress = (step / totalSteps) * 100;

    const handleNext = () => {
        if (step === 1 && selectedSkills.length === 0) {
            toast.error("Please select at least one skill.");
            return;
        }
        if (step === 2 && Object.keys(confidence).length < selectedSkills.length) {
            toast.error("Please rate your confidence for all selected skills.");
            return;
        }
        if (step === 3 && !goal) {
            toast.error("Please select a learning goal.");
            return;
        }

        if (step < totalSteps) {
            setStep(prev => prev + 1);
        } else {
            completeOnboarding();
        }
    };

    const completeOnboarding = () => {
        // Here you would typically save to backend
        console.log({ selectedSkills, confidence, goal });
        toast.success("Profile setup complete!");
        navigate('/learner/dashboard');
    };

    const toggleSkill = (id: string) => {
        setSelectedSkills(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const setSkillConfidence = (skillId: string, rating: number) => {
        setConfidence(prev => ({ ...prev, [skillId]: rating }));
    };

    return (
        <PageTransition>
            <div className="min-h-screen flex flex-col items-center justify-center p-4">

                {/* Progress Bar */}
                <div className="w-full max-w-2xl mb-8">
                    <div className="flex justify-between text-xs uppercase font-bold text-muted-foreground mb-2">
                        <span>Step {step} of {totalSteps}</span>
                        <span>{step === 1 ? 'Select Skills' : step === 2 ? 'Rate Confidence' : 'Set Goal'}</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>

                <div className="w-full max-w-2xl glass-card p-8 min-h-[500px] flex flex-col">
                    <AnimatePresence mode="wait">

                        {/* Step 1: Select Skills */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex-1 flex flex-col"
                            >
                                <h2 className="text-2xl font-bold mb-2">What skills do you want to track?</h2>
                                <p className="text-muted-foreground mb-6">Select the technologies or topics you want to retain.</p>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    {AVAILABLE_SKILLS.map(skill => (
                                        <motion.button
                                            key={skill.id}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => toggleSkill(skill.id)}
                                            className={`p-4 rounded-xl border text-left transition-all ${selectedSkills.includes(skill.id)
                                                    ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(var(--primary),0.3)]'
                                                    : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xs font-mono text-muted-foreground">{skill.category}</span>
                                                {selectedSkills.includes(skill.id) && <Check size={14} className="text-primary" />}
                                            </div>
                                            <div className="font-bold">{skill.name}</div>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Rate Confidence */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex-1 flex flex-col"
                            >
                                <h2 className="text-2xl font-bold mb-2">Rate your current confidence</h2>
                                <p className="text-muted-foreground mb-6">This helps us tailor the initial recall schedule.</p>

                                <div className="space-y-4">
                                    {selectedSkills.map(skillId => {
                                        const skill = AVAILABLE_SKILLS.find(s => s.id === skillId);
                                        return (
                                            <div key={skillId} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                                                <span className="font-bold text-lg mb-2 md:mb-0">{skill?.name}</span>
                                                <div className="flex gap-2">
                                                    {[1, 2, 3, 4, 5].map(rating => (
                                                        <button
                                                            key={rating}
                                                            onClick={() => setSkillConfidence(skillId, rating)}
                                                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${confidence[skillId] === rating
                                                                    ? 'bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/30'
                                                                    : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                                                                }`}
                                                        >
                                                            {rating}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Set Goal */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex-1 flex flex-col"
                            >
                                <h2 className="text-2xl font-bold mb-2">What is your primary goal?</h2>
                                <p className="text-muted-foreground mb-6">We'll adjust the intensity based on your objective.</p>

                                <div className="space-y-4">
                                    {GOALS.map(({ id, title, desc, icon: Icon }) => (
                                        <motion.button
                                            key={id}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                            onClick={() => setGoal(id)}
                                            className={`w-full text-left p-6 rounded-xl border transition-all flex items-center gap-6 ${goal === id
                                                    ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(var(--primary),0.2)]'
                                                    : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                                                }`}
                                        >
                                            <div className={`p-3 rounded-full ${goal === id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                                                <Icon size={24} />
                                            </div>
                                            <div>
                                                <h3 className={`text-lg font-bold ${goal === id ? 'text-primary' : 'text-foreground'}`}>{title}</h3>
                                                <p className="text-sm text-muted-foreground">{desc}</p>
                                            </div>
                                            {goal === id && <Check className="ml-auto text-primary" />}
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="mt-8 flex justify-end">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleNext}
                            className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-bold flex items-center gap-2 btn-glow"
                        >
                            {step === totalSteps ? 'Complete Setup' : 'Continue'} <ChevronRight size={18} />
                        </motion.button>
                    </div>

                </div>
            </div>
        </PageTransition>
    );
};

export default Onboarding;
