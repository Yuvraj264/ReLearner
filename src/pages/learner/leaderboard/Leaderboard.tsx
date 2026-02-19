import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, TrendingUp } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

const LEADERBOARD_DATA = [
    { rank: 1, name: "Sarah J.", xp: 12500, streak: 45, avatar: "SJ" },
    { rank: 2, name: "Mike Chen", xp: 11200, streak: 32, avatar: "MC" },
    { rank: 3, name: "Alex Tech", xp: 10850, streak: 28, avatar: "AT" },
    { rank: 4, name: "You", xp: 9500, streak: 12, avatar: "YO", isUser: true },
    { rank: 5, name: "Jessica L.", xp: 9200, streak: 15, avatar: "JL" },
    { rank: 6, name: "David K.", xp: 8900, streak: 8, avatar: "DK" },
    { rank: 7, name: "Emma W.", xp: 8500, streak: 21, avatar: "EW" },
];

const Leaderboard = () => {
    return (
        <PageTransition>
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Trophy className="text-warning" /> Leaderboard
                    </h1>
                    <p className="text-muted-foreground">Top learners this week vs. your performance.</p>
                </div>

                <div className="glass-card overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border/50 bg-muted/20">
                                <th className="p-4 font-semibold text-muted-foreground w-16">Rank</th>
                                <th className="p-4 font-semibold text-muted-foreground">Learner</th>
                                <th className="p-4 font-semibold text-muted-foreground">XP</th>
                                <th className="p-4 font-semibold text-muted-foreground">Streak</th>
                            </tr>
                        </thead>
                        <tbody>
                            {LEADERBOARD_DATA.map((user, index) => (
                                <motion.tr
                                    key={user.rank}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`border-b border-border/30 hover:bg-muted/30 transition-colors ${user.isUser ? 'bg-primary/5 hover:bg-primary/10' : ''}`}
                                >
                                    <td className="p-4 font-mono font-bold">
                                        {user.rank === 1 ? <Crown size={20} className="text-warning" /> :
                                            user.rank === 2 ? <Medal size={20} className="text-gray-400" /> :
                                                user.rank === 3 ? <Medal size={20} className="text-amber-700" /> :
                                                    `#${user.rank}`}
                                    </td>
                                    <td className="p-4 flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${user.isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'}`}>
                                            {user.avatar}
                                        </div>
                                        <span className={user.isUser ? 'font-bold text-primary' : 'font-medium'}>
                                            {user.name} {user.isUser && '(You)'}
                                        </span>
                                    </td>
                                    <td className="p-4 font-mono font-bold text-foreground">
                                        {user.xp.toLocaleString()}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded bg-orange-500/10 text-orange-500 w-fit">
                                            <Flame size={12} /> {user.streak} days
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageTransition>
    )
}

// Icon helper
const Flame = ({ size, className }: { size?: number, className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-2.246-3.646-2.618-4.085a.75.75 0 0 1 .458-1.293c2.783.1 5.38 1.487 7.07 3.52a.75.75 0 0 0 1.135-.008 7.97 7.97 0 0 0 .915-2.022c.11.332.19.673.237 1.018.17 1.25.045 2.373-.37 3.37-.414.996-1.118 1.848-1.996 2.458a2.5 2.5 0 0 0-.61 3.542l.02.018a.75.75 0 0 1-.58 1.282A7.962 7.962 0 0 1 8.5 14.5Z" />
    </svg>
)

export default Leaderboard;
