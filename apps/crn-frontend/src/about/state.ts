import { useAuth0CRN } from '@asap-hub/react-context';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getDiscover } from './api';

export const useDiscoverState = () => {
  const auth0 = useAuth0CRN();
  const { data } = useSuspenseQuery({
    queryKey: ['discover'],
    queryFn: async () => {
      const token = await auth0.getTokenSilently();
      return getDiscover(`Bearer ${token}`);
    },
  });
  return data;
};
