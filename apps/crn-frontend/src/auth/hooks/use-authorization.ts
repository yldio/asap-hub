import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../stores/auth.store';

export const useAuthorization = (): string => {
  const { getAuthorization, auth0 } = useAuthStore();

  const { data: authorization, error } = useQuery({
    queryKey: ['authorization'],
    queryFn: getAuthorization,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 3, // Don't retry auth failures
    enabled: !!auth0, // Only run the query when auth0 is available
    suspense: true, // Let React Query handle Suspense
  });

  if (error) {
    throw error;
  }

  // With suspense: true, authorization will always exist when this runs
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return authorization!;
};
