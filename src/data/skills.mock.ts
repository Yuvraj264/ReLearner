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
}

export const mockSkills: Skill[] = [
  {
    id: 'skill-1',
    name: 'React Component Architecture',
    category: 'Frontend',
    description: 'Design scalable, reusable component hierarchies with proper state management patterns.',
    role: 'Frontend Engineer',
    healthScore: 88,
    enrolled: true,
    learned: true,
    modules: [
      { id: 'm1', title: 'Component Composition', duration: '15 min', completed: true },
      { id: 'm2', title: 'State Lifting Patterns', duration: '12 min', completed: true },
      { id: 'm3', title: 'Custom Hooks Design', duration: '18 min', completed: true },
      { id: 'm4', title: 'Performance Optimization', duration: '20 min', completed: true },
    ],
    assessmentPassed: true,
    lastRecallDate: '2026-02-07T00:00:00Z',
    nextRecallDate: '2026-02-21T00:00:00Z',
    recallHistory: [
      { date: '2026-01-10T00:00:00Z', score: 92 },
      { date: '2026-01-24T00:00:00Z', score: 85 },
      { date: '2026-02-07T00:00:00Z', score: 88 },
    ],
    recallQuestions: [
      { id: 'q1', question: 'What pattern prevents prop drilling in deep component trees?', options: ['Context API', 'Higher-Order Components', 'Render Props', 'Direct Imports'], correctIndex: 0, explanation: 'Context API provides a way to share values between components without explicitly passing props.' },
      { id: 'q2', question: 'When should you memoize a component?', options: ['Always', 'When it re-renders with same props frequently', 'Never', 'Only for class components'], correctIndex: 1, explanation: 'Memoization prevents unnecessary re-renders when props haven\'t changed.' },
      { id: 'q3', question: 'What is the recommended way to share stateful logic between components?', options: ['Mixins', 'Custom Hooks', 'Inheritance', 'Global variables'], correctIndex: 1, explanation: 'Custom hooks let you extract and share stateful logic without changing component hierarchy.' },
    ],
    learnedDate: '2025-12-20T00:00:00Z',
    enrolledDate: '2025-12-01T00:00:00Z',
  },
  {
    id: 'skill-2',
    name: 'SQL Query Optimization',
    category: 'Backend',
    description: 'Write efficient SQL queries, understand execution plans, and optimize database performance.',
    role: 'Backend Engineer',
    healthScore: 52,
    enrolled: true,
    learned: true,
    modules: [
      { id: 'm1', title: 'Index Fundamentals', duration: '14 min', completed: true },
      { id: 'm2', title: 'Query Execution Plans', duration: '16 min', completed: true },
      { id: 'm3', title: 'Join Optimization', duration: '20 min', completed: true },
    ],
    assessmentPassed: true,
    lastRecallDate: '2026-01-15T00:00:00Z',
    nextRecallDate: '2026-02-11T00:00:00Z',
    recallHistory: [
      { date: '2025-12-20T00:00:00Z', score: 78 },
      { date: '2026-01-05T00:00:00Z', score: 65 },
      { date: '2026-01-15T00:00:00Z', score: 52 },
    ],
    recallQuestions: [
      { id: 'q1', question: 'What does EXPLAIN ANALYZE do differently from EXPLAIN?', options: ['Nothing', 'Actually executes the query', 'Only shows cost', 'Drops the table'], correctIndex: 1, explanation: 'EXPLAIN ANALYZE actually runs the query and shows real execution times alongside the plan.' },
      { id: 'q2', question: 'Which join type preserves all rows from the left table?', options: ['INNER JOIN', 'LEFT JOIN', 'CROSS JOIN', 'SELF JOIN'], correctIndex: 1, explanation: 'LEFT JOIN returns all rows from the left table, with NULL for non-matching right rows.' },
      { id: 'q3', question: 'What is a covering index?', options: ['An index that covers all tables', 'An index containing all columns needed by a query', 'A primary key', 'An index on every column'], correctIndex: 1, explanation: 'A covering index includes all columns referenced in a query, avoiding table lookups.' },
    ],
    learnedDate: '2025-12-10T00:00:00Z',
    enrolledDate: '2025-11-20T00:00:00Z',
  },
  {
    id: 'skill-3',
    name: 'System Design Fundamentals',
    category: 'Architecture',
    description: 'Design distributed systems with focus on scalability, reliability, and performance trade-offs.',
    role: 'Senior Engineer',
    healthScore: 31,
    enrolled: true,
    learned: true,
    modules: [
      { id: 'm1', title: 'Load Balancing', duration: '15 min', completed: true },
      { id: 'm2', title: 'Caching Strategies', duration: '18 min', completed: true },
      { id: 'm3', title: 'Database Sharding', duration: '22 min', completed: true },
      { id: 'm4', title: 'Message Queues', duration: '16 min', completed: true },
    ],
    assessmentPassed: true,
    lastRecallDate: '2025-12-28T00:00:00Z',
    nextRecallDate: '2026-02-10T00:00:00Z',
    recallHistory: [
      { date: '2025-11-15T00:00:00Z', score: 82 },
      { date: '2025-12-01T00:00:00Z', score: 60 },
      { date: '2025-12-28T00:00:00Z', score: 31 },
    ],
    recallQuestions: [
      { id: 'q1', question: 'What is the CAP theorem?', options: ['Consistency, Availability, Partition tolerance tradeoff', 'Cache And Proxy', 'Central Access Point', 'Compute Architecture Plan'], correctIndex: 0, explanation: 'CAP theorem states a distributed system can provide at most two of three guarantees simultaneously.' },
      { id: 'q2', question: 'When would you choose eventual consistency over strong consistency?', options: ['Never', 'When availability is more important', 'When data is small', 'When using SQL'], correctIndex: 1, explanation: 'Eventual consistency is preferred when high availability is critical and brief inconsistency is acceptable.' },
      { id: 'q3', question: 'What problem does a message queue solve?', options: ['SQL injection', 'Decoupling producers and consumers', 'CSS styling', 'Authentication'], correctIndex: 1, explanation: 'Message queues decouple systems, allowing asynchronous processing and handling traffic spikes.' },
    ],
    learnedDate: '2025-11-01T00:00:00Z',
    enrolledDate: '2025-10-15T00:00:00Z',
  },
  {
    id: 'skill-4',
    name: 'REST API Design',
    category: 'Backend',
    description: 'Design clean, consistent, and well-documented RESTful APIs following industry best practices.',
    role: 'Backend Engineer',
    healthScore: 0,
    enrolled: true,
    learned: false,
    modules: [
      { id: 'm1', title: 'Resource Naming', duration: '10 min', completed: true },
      { id: 'm2', title: 'HTTP Methods & Status Codes', duration: '12 min', completed: true },
      { id: 'm3', title: 'Pagination & Filtering', duration: '15 min', completed: false },
      { id: 'm4', title: 'Versioning Strategies', duration: '10 min', completed: false },
    ],
    assessmentPassed: false,
    lastRecallDate: null,
    nextRecallDate: null,
    recallHistory: [],
    recallQuestions: [
      { id: 'q1', question: 'Which HTTP method is idempotent?', options: ['POST', 'PUT', 'PATCH (usually)', 'All of them'], correctIndex: 1, explanation: 'PUT is idempotent — calling it multiple times with the same payload produces the same result.' },
    ],
    learnedDate: null,
    enrolledDate: '2026-01-20T00:00:00Z',
  },
  {
    id: 'skill-5',
    name: 'Docker & Containerization',
    category: 'DevOps',
    description: 'Build, ship, and run applications using containers with Docker and container orchestration basics.',
    role: 'DevOps Engineer',
    healthScore: 0,
    enrolled: false,
    learned: false,
    modules: [
      { id: 'm1', title: 'Docker Basics', duration: '12 min', completed: false },
      { id: 'm2', title: 'Dockerfile Best Practices', duration: '15 min', completed: false },
      { id: 'm3', title: 'Docker Compose', duration: '18 min', completed: false },
    ],
    assessmentPassed: false,
    lastRecallDate: null,
    nextRecallDate: null,
    recallHistory: [],
    recallQuestions: [],
    learnedDate: null,
    enrolledDate: null,
  },
  {
    id: 'skill-6',
    name: 'TypeScript Advanced Types',
    category: 'Frontend',
    description: 'Master advanced TypeScript type system features including generics, conditional types, and mapped types.',
    role: 'Frontend Engineer',
    healthScore: 75,
    enrolled: true,
    learned: true,
    modules: [
      { id: 'm1', title: 'Generics Deep Dive', duration: '20 min', completed: true },
      { id: 'm2', title: 'Conditional Types', duration: '15 min', completed: true },
      { id: 'm3', title: 'Mapped & Template Literal Types', duration: '18 min', completed: true },
    ],
    assessmentPassed: true,
    lastRecallDate: '2026-02-03T00:00:00Z',
    nextRecallDate: '2026-02-17T00:00:00Z',
    recallHistory: [
      { date: '2026-01-15T00:00:00Z', score: 80 },
      { date: '2026-02-03T00:00:00Z', score: 75 },
    ],
    recallQuestions: [
      { id: 'q1', question: 'What does `infer` do in conditional types?', options: ['Defines a variable', 'Extracts a type within a conditional', 'Creates an interface', 'Imports a module'], correctIndex: 1, explanation: 'The infer keyword lets you extract a type from within a conditional type expression.' },
    ],
    learnedDate: '2026-01-05T00:00:00Z',
    enrolledDate: '2025-12-15T00:00:00Z',
  },
];
