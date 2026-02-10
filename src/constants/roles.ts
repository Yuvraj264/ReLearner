export const ROLES = {
  LEARNER: 'learner',
  ADMIN: 'admin',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];
