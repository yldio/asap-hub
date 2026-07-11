import { useSuspenseQuery } from '@tanstack/react-query';

import { useAuthorization } from '../auth/useAuthorization';
import { getDashboardStats, getNews, getReminders } from './api';

// The dashboard owns its own namespace: its `news` key is DISTINCT from the
// news module's `newsQueryKeys` — different fetchers (REST `getNews` here vs
// Algolia `getAlgoliaNews` there), so the caches must not be shared.
export const dashboardQueryKeys = {
  all: ['dashboard'] as const,
  news: () => [...dashboardQueryKeys.all, 'news'] as const,
  stats: () => [...dashboardQueryKeys.all, 'stats'] as const,
  reminders: () => [...dashboardQueryKeys.all, 'reminders'] as const,
};

export const useNews = () => {
  const getAuthorization = useAuthorization();
  return useSuspenseQuery({
    queryKey: dashboardQueryKeys.news(),
    queryFn: async () => getNews(await getAuthorization()),
  }).data;
};

export const useDashboard = () => {
  const getAuthorization = useAuthorization();
  return useSuspenseQuery({
    queryKey: dashboardQueryKeys.stats(),
    queryFn: async () => getDashboardStats(await getAuthorization()),
  }).data;
};

export const useReminderState = () => {
  const getAuthorization = useAuthorization();
  return useSuspenseQuery({
    queryKey: dashboardQueryKeys.reminders(),
    queryFn: async () => getReminders(await getAuthorization()),
  }).data;
};
