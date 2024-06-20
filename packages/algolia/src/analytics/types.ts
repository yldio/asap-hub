export const TEAM_LEADERSHIP = 'team-leadership';
export const TEAM_PRODUCTIVITY = 'team-productivity';
export const USER_PRODUCTIVITY = 'user-productivity';
export const TEAM_COLLABORATION = 'team-collaboration';
export const USER_COLLABORATION = 'user-collaboration';

export const USER_PRODUCTIVITY_PERFORMANCE = 'user-productivity-performance';
export const TEAM_PRODUCTIVITY_PERFORMANCE = 'team-productivity-performance';

const types = [
  TEAM_LEADERSHIP,
  TEAM_PRODUCTIVITY,
  USER_PRODUCTIVITY,
  TEAM_COLLABORATION,
  USER_COLLABORATION,
];
export type AnalyticType = (typeof types)[number];
