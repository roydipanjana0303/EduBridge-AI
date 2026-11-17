export const ROUTES = {
  LANDING: '/',
  AUTH: '/login',
  DASHBOARD: '/dashboard',
  NOTES: '/notes',
  CHAT: '/chat',
  VOICE: '/voice-rooms',
  GROUPS: '/groups',
  QA: '/qa',
  AI_ASSISTANT: '/ai',
  GAP_RECOVERY: '/study-gap-recovery',
  CAREER: '/career-roadmaps',
  ASSESSMENTS: '/assessments',
  OFFLINE: '/offline',
  REWARDS: '/rewards',
} as const;

export type AppRoute = typeof ROUTES[keyof typeof ROUTES];
