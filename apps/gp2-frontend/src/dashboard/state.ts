import { gp2, ListReminderResponse } from '@asap-hub/model';
import { atom, selector, useRecoilValue } from 'recoil';
import { authorizationState } from '../auth/state';
import { getDashboardStats, getNews, getReminders } from './api';

const fetchNewsState = selector<gp2.ListNewsResponse>({
  key: 'fetchNewsState',
  get: ({ get }) => getNews(get(authorizationState)),
});

const newsState = atom<gp2.ListNewsResponse>({
  key: 'news',
  default: fetchNewsState,
});

export const useNews = () => useRecoilValue(newsState);

const fetchDashboardState = selector<gp2.ListDashboardResponse>({
  key: 'fetchDashboardState',
  get: ({ get }) => getDashboardStats(get(authorizationState)),
});

const dashboardState = atom<gp2.ListDashboardResponse>({
  key: 'dashboard',
  default: fetchDashboardState,
});

export const fetchRemindersState = selector<ListReminderResponse>({
  key: 'fetchRemindersState',
  get: ({ get }) => getReminders(get(authorizationState)),
});

export const reminderState = atom<ListReminderResponse>({
  key: 'reminderState',
  default: fetchRemindersState,
});

export const useDashboard = () => useRecoilValue(dashboardState);
export const useReminderState = () => useRecoilValue(reminderState);
