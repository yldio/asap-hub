import { renderHook } from '@testing-library/react-hooks';
import { useAuth0CRN } from '../auth0';

describe('the default context value', () => {
  it('has a loading auth0 state', () => {
    const { loading } = renderHook(useAuth0CRN).result.current;
    expect(loading).toBe(true);
  });

  it('throws when trying to call methods despite Auth0 not being loaded', () => {
    const { loginWithRedirect } = renderHook(useAuth0CRN).result.current;
    expect(loginWithRedirect).toThrow(/auth0/i);
  });
});
