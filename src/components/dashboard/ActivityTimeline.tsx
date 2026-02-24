import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, AlertCircle, PlusCircle, Flame, Clock } from 'lucide-react';

export type ActivityType = 'recall_completed' | 'skill_risk_change' | 'new_skill_added' | 'streak_milestone' | 'module_completed';

export interface ActivityEvent {
    id: string;
    type: ActivityType;
    title: string;
    description: string;
    createdAt: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata?: any;
}

interface ActivityTimelineProps {
    events?: ActivityEvent[];
    className?: string;
}

const mockEvents: ActivityEvent[] = [
    {
        id: '1',
        type: 'streak_milestone',
        title: '7-Day Streak!',
        description: 'You\'ve maintained your learning streak for a full week.',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: '2',
        type: 'recall_completed',
        title: 'Recall Completed',
        description: 'Successfully reviewed "React Hooks" with 95% accuracy.',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: '3',
        type: 'skill_risk_change',
        title: 'Skill at Risk',
        description: '"Advanced TypeScript" has dropped to At-Risk status.',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: '4',
        type: 'new_skill_added',
        title: 'New Track Started',
        description: 'You added "System Design" to your learning path.',
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    },
];

const timeAgo = (dateStr: string) => {
    const time = new Date(dateStr).getTime();
    const now = Date.now();
    const diffInSeconds = Math.floor((now - time) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return `1 day ago`;
    return `${diffInDays} days ago`;
};

const getEventConfig = (type: ActivityType) => {
    switch (type) {
        case 'recall_completed':
            return {
                icon: Award,
                color: 'text-healthy',
                bgColor: 'bg-healthy/10',
                borderColor: 'border-healthy/20',
            };
        case 'skill_risk_change':
            return {
                icon: AlertCircle,
                color: 'text-warning',
                bgColor: 'bg-warning/10',
                borderColor: 'border-warning/20',
            };
        case 'new_skill_added':
            return {
                icon: PlusCircle,
                color: 'text-primary',
                bgColor: 'bg-primary/10',
                borderColor: 'border-primary/20',
            };
        case 'streak_milestone':
            return {
                icon: Flame,
                color: 'text-orange-500',
                bgColor: 'bg-orange-500/10',
                borderColor: 'border-orange-500/20',
            };
        case 'module_completed':
            return {
                icon: Award,
                color: 'text-primary',
                bgColor: 'bg-primary/10',
                borderColor: 'border-primary/20',
            };
        default:
            return {
                icon: Clock,
                color: 'text-muted-foreground',
                bgColor: 'bg-muted/10',
                borderColor: 'border-muted/20',
            };
    }
};

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ events, className }) => {
    const [fetchedEvents, setFetchedEvents] = useState<ActivityEvent[]>([]);
    const [isLoading, setIsLoading] = useState(!events);

    useEffect(() => {
        if (events) return; // Use props if provided

        const loadActivities = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setFetchedEvents(mockEvents);
                    setIsLoading(false);
                    return;
                }

                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/activities`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.length > 0) {
                        // Map _id to id
                        const mapped = data.map((d: any) => ({ ...d, id: d._id }));
                        setFetchedEvents(mapped);
                    } else {
                        setFetchedEvents(mockEvents); // Fallback to mock if empty for demo purposes
                    }
                } else {
                    setFetchedEvents(mockEvents); // Fallback
                }
            } catch (err) {
                console.error("Failed to load activities:", err);
                setFetchedEvents(mockEvents);
            } finally {
                setIsLoading(false);
            }
        };

        loadActivities();
    }, [events]);

    const displayEvents = events || fetchedEvents;

    if (isLoading) {
        return <div className={`p-6 rounded-xl bg-card/40 backdrop-blur-md border border-white/5 animate-pulse h-64 ${className || ''}`} />;
    }

    return (
        <div className={`p-6 rounded-xl bg-card/40 backdrop-blur-md border border-white/5 ${className || ''}`}>
            <div className="flex items-center gap-2 mb-8">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Activity Timeline</h3>
            </div>

            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                {displayEvents.map((event, index) => {
                    const config = getEventConfig(event.type);
                    const Icon = config.icon;

                    return (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.15, ease: 'easeOut' }}
                            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                        >
                            {/* Timeline Center Dot & Icon */}
                            <div
                                className={`flex items-center justify-center w-10 h-10 rounded-full border border-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 box-content overflow-hidden ring-2 ring-background ${config.bgColor} ${config.color}`}
                            >
                                <Icon size={18} strokeWidth={2.5} />
                            </div>

                            {/* Event Content Card */}
                            <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-lg focus-within:ring-2 focus-within:ring-primary/50 relative ${config.borderColor} border-l-2 md:group-even:border-l-2 md:group-even:border-r-[1px] md:group-odd:border-r-2 md:group-odd:border-l-[1px]`}>
                                <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                                    <span className={`font-semibold text-sm ${config.color}`}>
                                        {event.title}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground font-medium px-2 py-0.5 rounded-md bg-black/40 border border-white/5 whitespace-nowrap">
                                        {timeAgo(event.createdAt)}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {event.description}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default ActivityTimeline;
