export interface Notification {
  id: string;
  type: 'recall_due' | 'skill_decay' | 'achievement' | 'reminder';
  title: string;
  message: string;
  read: boolean;
  date: string;
  skillId?: string;
}

const mockNotifications: Notification[] = [
  { id: 'n1', type: 'recall_due', title: 'Recall Due: System Design', message: 'Your System Design skill is critically low. Complete a recall session now.', read: false, date: '2026-02-10T08:00:00Z', skillId: 'skill-3' },
  { id: 'n2', type: 'skill_decay', title: 'SQL Optimization at Risk', message: 'Your SQL query optimization score has dropped to 52%. Review recommended.', read: false, date: '2026-02-09T10:00:00Z', skillId: 'skill-2' },
  { id: 'n3', type: 'recall_due', title: 'Upcoming: React Architecture', message: 'Your next recall session for React Component Architecture is in 11 days.', read: true, date: '2026-02-08T09:00:00Z', skillId: 'skill-1' },
  { id: 'n4', type: 'achievement', title: '3-Recall Streak!', message: 'You completed 3 recall sessions in a row. Keep your skills sharp!', read: true, date: '2026-02-07T16:00:00Z' },
  { id: 'n5', type: 'reminder', title: 'Weekly Summary', message: 'You have 2 skills at risk and 1 critical skill. Review your dashboard.', read: true, date: '2026-02-05T08:00:00Z' },
];

let notifications = [...mockNotifications];

export const notificationService = {
  getNotifications: (): Notification[] => notifications,

  getUnreadCount: (): number => notifications.filter(n => !n.read).length,

  markAsRead: (id: string): void => {
    notifications = notifications.map(n => n.id === id ? { ...n, read: true } : n);
  },

  markAllRead: (): void => {
    notifications = notifications.map(n => ({ ...n, read: true }));
  },
};
