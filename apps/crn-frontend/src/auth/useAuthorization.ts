import { useAuth0CRN } from '@asap-hub/react-context';
import { useCallback } from 'react';

/**
 * Returns an async accessor for the `Bearer <token>` authorization header,
 * for use inside React Query queryFn / mutation closures. Throws if called
 * before the Auth0 context is ready — which cannot happen inside
 * AuthenticatedApp, but should fail loudly rather than silently.
 * auth0-spa-js caches tokens internally, so calling this once per request
 * does not add network round-trips.
 */
export const useAuthorization = (): (() => Promise<string>) => {
  const { loading, getTokenSilently } = useAuth0CRN();
  return useCallback(async () => {
    if (loading) {
      throw new Error(
        'Auth0 is not ready; cannot get an authorization token yet',
      );
    }
    return `Bearer ${await getTokenSilently()}`;
  }, [loading, getTokenSilently]);
};
