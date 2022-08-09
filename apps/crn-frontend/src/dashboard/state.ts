import { selector, atom, useRecoilValue } from 'recoil';
import { DashboardResponse, ListReminderResponse } from '@asap-hub/model';
import { authorizationState } from '../auth/state';
import { getDashboard, getReminders } from './api';

export const fetchDashboardState = selector<DashboardResponse>({
  key: 'fetchDashboardState',
  get: ({ get }) => {
    get(refreshDashboardState);
    return getDashboard(get(authorizationState));
  },
});

export const dashboardState = atom<DashboardResponse>({
  key: 'dashboardState',
  default: fetchDashboardState,
});

export const refreshDashboardState = atom<number>({
  key: 'refreshDashboardState',
  default: 0,
});

export const fetchRemindersState = selector<ListReminderResponse>({
  key: 'fetchRemindersState',
  get: ({ get }) => {
    get(refreshDashboardState);
    return getReminders(get(authorizationState));
  },
});

export const reminderState = atom<ListReminderResponse>({
  key: 'reminderState',
  default: fetchRemindersState,
});

export const useDashboardState = () => useRecoilValue(dashboardState);
export const useReminderState = () => useRecoilValue(reminderState);
