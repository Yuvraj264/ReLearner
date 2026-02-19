export interface SkillModule {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
}

export interface RecallQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
  role: string;
  healthScore: number;
  enrolled: boolean;
  learned: boolean;
  modules: SkillModule[];
  assessmentPassed: boolean;
  lastRecallDate: string | null;
  nextRecallDate: string | null;
  recallHistory: { date: string; score: number }[];
  recallQuestions: RecallQuestion[];
  learnedDate: string | null;
  enrolledDate: string | null;
  decayRate?: number;
  criticalThreshold?: number;
}

export const mockSkills: Skill[] = [
  {
    id: 'skill-1',
    name: 'Python Advanced Concepts',
    category: 'Backend',
    description: 'Master decorators, generators, and metaclasses for high-performance Python applications.',
    role: 'Backend Engineer',
    healthScore: 35, // Low (Critical) to test Red zone & Alert
    enrolled: true,
    learned: true,
    decayRate: 0.12, // High decay
    criticalThreshold: 40,
    modules: [
      { id: 'm1', title: 'Generators & Iterators', duration: '15 min', completed: true },
      { id: 'm2', title: 'Decorators and Wrappers', duration: '20 min', completed: true },
      { id: 'm3', title: 'Metaclasses Deep Dive', duration: '25 min', completed: true },
      { id: 'm4', title: 'Concurrency with AsyncIO', duration: '30 min', completed: true },
    ],
    assessmentPassed: true,
    lastRecallDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
    nextRecallDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // Due in 2 hours (CRITICAL COUNTDOWN TEST)
    recallHistory: [
      { date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), score: 95 },
      { date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), score: 75 },
      { date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), score: 55 },
    ],
    recallQuestions: [
      { id: 'q1', question: 'What is the primary purpose of a decorator?', options: ['Styling UI', 'Modifying function behavior dynamically', 'Creating classes', 'Database mapping'], correctIndex: 1, explanation: 'Decorators are a design pattern that allows a user to add new functionality to an existing object without modifying its structure.' },
    ],
    learnedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    enrolledDate: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'skill-2',
    name: 'React Architecture',
    category: 'Frontend',
    description: 'Scalable patterns, state management, and performance optimization for React apps.',
    role: 'Frontend Engineer',
    healthScore: 62, // Medium (At Risk) to test Orange zone
    enrolled: true,
    learned: true,
    decayRate: 0.05,
    criticalThreshold: 40,
    modules: [
      { id: 'm1', title: 'Atomic Design', duration: '14 min', completed: true },
      { id: 'm2', title: 'State Machines', duration: '18 min', completed: true },
      { id: 'm3', title: 'Performance Tuning', duration: '22 min', completed: true },
    ],
    assessmentPassed: true,
    lastRecallDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    nextRecallDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Due in 2 days
    recallHistory: [
      { date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), score: 88 },
      { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), score: 72 },
    ],
    recallQuestions: [
      { id: 'q1', question: 'Which hook optimizes expensive calculations?', options: ['useEffect', 'useMemo', 'useState', 'useRef'], correctIndex: 1, explanation: 'useMemo returns a memoized value and only recomputes it when dependencies change.' },
    ],
    learnedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    enrolledDate: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'skill-3',
    name: 'System Design',
    category: 'Architecture',
    description: 'Designing distributed systems, scalability, and reliability patterns.',
    role: 'Senior Engineer',
    healthScore: 94, // High (Healthy) to test Green zone
    enrolled: true,
    learned: true,
    decayRate: 0.02, // Low decay
    criticalThreshold: 40,
    modules: [
      { id: 'm1', title: 'CAP Theorem', duration: '12 min', completed: true },
      { id: 'm2', title: 'Load Balancing', duration: '15 min', completed: true },
      { id: 'm3', title: 'Database Sharding', duration: '20 min', completed: true },
    ],
    assessmentPassed: true,
    lastRecallDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    nextRecallDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // Due in 10 days
    recallHistory: [
      { date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(), score: 80 },
      { date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), score: 85 },
      { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), score: 96 },
    ],
    recallQuestions: [
      { id: 'q1', question: 'What does the C in CAP stand for?', options: ['Consistency', 'Availability', 'Partition Tolerance', 'Computing'], correctIndex: 0, explanation: 'Consistency implies that every read receives the most recent write or an error.' },
    ],
    learnedDate: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    enrolledDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'skill-4',
    name: 'Kubernetes Networking',
    category: 'DevOps',
    description: 'Deep dive into CNI, Service Mesh, and Ingress controllers.',
    role: 'DevOps Engineer',
    healthScore: 0, // Not started
    enrolled: true,
    learned: false,
    decayRate: 0.1,
    criticalThreshold: 40,
    modules: [
      { id: 'm1', title: 'Pod Networking', duration: '20 min', completed: true },
      { id: 'm2', title: 'Service Discovery', duration: '25 min', completed: false },
    ],
    assessmentPassed: false,
    lastRecallDate: null,
    nextRecallDate: null,
    recallHistory: [],
    recallQuestions: [],
    learnedDate: null,
    enrolledDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
