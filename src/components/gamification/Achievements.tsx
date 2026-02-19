import { Award, Zap, Flame, Target, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const ACHIEVEMENTS = [
    { id: 1, title: "Fast Learner", desc: "Complete 5 modules in a day", icon: Zap, unlocked: true },
    { id: 2, title: "7 Day Streak", desc: "Practice for 7 days in a row", icon: Flame, unlocked: true },
    { id: 3, title: "Quiz Master", desc: "Score 100% on a recall session", icon: Target, unlocked: false },
    { id: 4, title: "Bookworm", desc: "Read 10 documentation pages", icon: BookOpen, unlocked: false },
    { id: 5, title: "Early Adopter", desc: "Join during beta phase", icon: Award, unlocked: true },
];

export const Achievements = () => {
    return (
        <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Award className="text-primary" /> Achievements
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {ACHIEVEMENTS.map((achievement) => {
                    const Icon = achievement.icon;
                    return (
                        <motion.div
                            key={achievement.id}
                            className={`p-4 rounded-xl border flex flex-col items-center text-center gap-3 transition-colors ${achievement.unlocked
                                    ? "bg-primary/5 border-primary/20"
                                    : "bg-muted/50 border-white/5 opacity-50 grayscale"
                                }`}
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className={`p-3 rounded-full ${achievement.unlocked ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                                <Icon size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">{achievement.title}</h4>
                                <p className="text-xs text-muted-foreground mt-1">{achievement.desc}</p>
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}
