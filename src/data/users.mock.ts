export interface User {
  id: string;
  name: string;
  email: string;
  role: 'learner' | 'admin';
  avatar?: string;
  joinedAt: string;
}

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Alex Rivera',
    email: 'alex@example.com',
    role: 'learner',
    joinedAt: '2024-08-15T00:00:00Z',
  },
  {
    id: 'admin-1',
    name: 'Sam Chen',
    email: 'admin@example.com',
    role: 'admin',
    joinedAt: '2024-01-01T00:00:00Z',
  },
];

export const currentLearner = mockUsers[0];
export const currentAdmin = mockUsers[1];
