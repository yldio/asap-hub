import { useAuth0GP2 } from '@asap-hub/react-context';
import { useCallback } from 'react';

/**
 * Returns an async accessor for the `Bearer <token>` authorization header,
 * for use inside React Query queryFn / mutation closures. Replaces the recoil
 * `authorizationState` selector: that selector suspended until auth0 was
 * ready, whereas this accessor throws if called before the Auth0 context is
 * ready — which cannot happen inside AuthenticatedApp, but should fail loudly
 * rather than silently. auth0-spa-js caches tokens internally, so calling
 * this once per request does not add network round-trips.
 */
export const useAuthorization = (): (() => Promise<string>) => {
  const { loading, getTokenSilently } = useAuth0GP2();
  return useCallback(async () => {
    if (loading) {
      throw new Error(
        'Auth0 is not ready; cannot get an authorization token yet',
      );
    }
    return `Bearer ${await getTokenSilently()}`;
  }, [loading, getTokenSilently]);
};
