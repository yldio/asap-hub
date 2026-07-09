import { DashboardResponse, ListReminderResponse } from '@asap-hub/model';
import { useSuspenseQuery } from '@tanstack/react-query';

import { useAuthorization } from '../auth/useAuthorization';
import { getDashboard, getReminders } from './api';

// Both fetches shared the single refreshDashboardState counter in recoil, so
// they share the 'dashboard' key root — invalidating it refreshes both.
export const dashboardQueryKeys = {
  all: ['dashboard'] as const,
  data: () => [...dashboardQueryKeys.all, 'data'] as const,
  reminders: () => [...dashboardQueryKeys.all, 'reminders'] as const,
};

export const useDashboardState = (): DashboardResponse => {
  const getAuthorization = useAuthorization();
  return useSuspenseQuery({
    queryKey: dashboardQueryKeys.data(),
    queryFn: async () => getDashboard(await getAuthorization()),
  }).data;
};

export const useReminderState = (): ListReminderResponse => {
  const getAuthorization = useAuthorization();
  return useSuspenseQuery({
    queryKey: dashboardQueryKeys.reminders(),
    queryFn: async () => getReminders(await getAuthorization()),
  }).data;
};
