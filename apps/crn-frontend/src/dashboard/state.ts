import { useAuth0CRN } from '@asap-hub/react-context';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getDashboard, getReminders } from './api';

export const useDashboardState = () => {
  const auth0 = useAuth0CRN();
  const { data } = useSuspenseQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const token = await auth0.getTokenSilently();
      return getDashboard(`Bearer ${token}`);
    },
  });
  return data;
};

export const useReminderState = () => {
  const auth0 = useAuth0CRN();
  const { data } = useSuspenseQuery({
    queryKey: ['reminders'],
    queryFn: async () => {
      const token = await auth0.getTokenSilently();
      return getReminders(`Bearer ${token}`);
    },
  });
  return data;
};
