import { ListGuideResponse } from '@asap-hub/model';
import { useAuth0CRN } from '@asap-hub/react-context';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getGuides } from './api';

export const useGuidesByCollection = (
  collection: string,
): ListGuideResponse | undefined => {
  const auth0 = useAuth0CRN();
  const { data } = useSuspenseQuery({
    queryKey: ['guides', collection],
    queryFn: async (): Promise<ListGuideResponse> => {
      const token = await auth0.getTokenSilently();
      return getGuides(`Bearer ${token}`, collection);
    },
  });
  return data;
};
