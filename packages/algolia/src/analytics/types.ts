export const TEAM_LEADERSHIP = 'team-leadership';
export const TEAM_PRODUCTIVITY = 'team-productivity';
export const USER_PRODUCTIVITY = 'user-productivity';
export const TEAM_COLLABORATION = 'team-collaboration';
export const USER_COLLABORATION = 'user-collaboration';
export const ENGAGEMENT = 'engagement';

export const USER_PRODUCTIVITY_PERFORMANCE = 'user-productivity-performance';
export const TEAM_PRODUCTIVITY_PERFORMANCE = 'team-productivity-performance';
export const TEAM_COLLABORATION_PERFORMANCE = 'team-collaboration-performance';
export const USER_COLLABORATION_PERFORMANCE = 'user-collaboration-performance';

const types = [
  TEAM_LEADERSHIP,
  TEAM_PRODUCTIVITY,
  USER_PRODUCTIVITY,
  TEAM_COLLABORATION,
  USER_COLLABORATION,
  ENGAGEMENT,
] as const;
export type AnalyticType = (typeof types)[number];

const performanceTypes = [
  USER_PRODUCTIVITY_PERFORMANCE,
  TEAM_PRODUCTIVITY_PERFORMANCE,
  TEAM_COLLABORATION_PERFORMANCE,
  USER_COLLABORATION_PERFORMANCE,
] as const;
export type AnalyticPerformanceType = (typeof performanceTypes)[number];
