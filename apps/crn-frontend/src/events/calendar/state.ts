import { useAuth0CRN } from '@asap-hub/react-context';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getCalendars } from './api';

export const useCalendars = () => {
  const auth0 = useAuth0CRN();
  const { data } = useSuspenseQuery({
    queryKey: ['calendars'],
    queryFn: async () => {
      const token = await auth0.getTokenSilently();
      return getCalendars(`Bearer ${token}`);
    },
  });
  return data;
};
