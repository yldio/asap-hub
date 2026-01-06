import { renderHook } from '@testing-library/react';
import { useAuth0CRN } from '../auth0';

describe('the default context value', () => {
  it('has a loading auth0 state', () => {
    const { result } = renderHook(useAuth0CRN);
    expect(result.current.loading).toBe(true);
  });

  it('throws when trying to call methods despite Auth0 not being loaded', () => {
    const { result } = renderHook(useAuth0CRN);
    expect(result.current.loginWithRedirect).toThrow(/auth0/i);
  });
});
