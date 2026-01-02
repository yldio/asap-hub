import { render, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import * as reactContext from '@asap-hub/react-context';

import ContinueOnboarding from '../ContinueOnboarding';

jest.mock('@asap-hub/react-context', () => {
  const original = jest.requireActual('@asap-hub/react-context');
  return {
    ...original,
    useAuth0CRN: jest.fn(),
  };
});

const mockUseAuth0CRN = reactContext.useAuth0CRN as jest.MockedFunction<
  typeof reactContext.useAuth0CRN
>;

beforeEach(() => {
  jest.clearAllMocks();
});

it('renders its children once Auth0 is loaded', async () => {
  // Simulate Auth0 loading: starts as true, then becomes false
  // When auth0Loading is true, setLoading(false) is called, so children render
  mockUseAuth0CRN
    .mockReturnValueOnce({
      isAuthenticated: true,
      loading: true, // Auth0 is still loading
      getTokenSilently: jest.fn().mockResolvedValue('token'),
    } as never)
    .mockReturnValue({
      isAuthenticated: true,
      loading: false, // Auth0 finished loading
      getTokenSilently: jest.fn().mockResolvedValue('token'),
    } as never);

  const { getByText } = render(
    <RecoilRoot>
      <ContinueOnboarding>content</ContinueOnboarding>
    </RecoilRoot>,
  );

  // When auth0Loading is true, setLoading(false) is called, so children should render
  await waitFor(() => expect(getByText('content')).toBeVisible());
});

it('returns null when loading is true', async () => {
  // This covers line 24: return loading ? null : <>{children}</>;
  // When auth0Loading is false, useEffect returns early (line 17)
  // so setLoading(false) is never called, loading stays true, returns null
  mockUseAuth0CRN.mockReturnValue({
    isAuthenticated: false,
    loading: false, // Auth0 finished loading
    getTokenSilently: jest.fn(),
  } as never);

  const { container } = render(
    <RecoilRoot>
      <ContinueOnboarding>content</ContinueOnboarding>
    </RecoilRoot>,
  );

  // The component starts with loading=true (useState(true))
  // When auth0Loading is false, useEffect returns early (line 17)
  // so setLoading(false) is never called, loading stays true, returns null
  // Wait for the effect to run and state to stabilize
  await waitFor(() => {
    expect(container.firstChild).toBeNull();
  });
});

it('sets loading to false when auth0Loading is true', () => {
  // This covers line 20: setLoading(false);
  // When auth0Loading is true, the useEffect should set loading to false
  mockUseAuth0CRN.mockReturnValue({
    isAuthenticated: false,
    loading: true, // Auth0 is still loading
    getTokenSilently: jest.fn(),
  } as never);

  const { getByText } = render(
    <RecoilRoot>
      <ContinueOnboarding>content</ContinueOnboarding>
    </RecoilRoot>,
  );

  // When auth0Loading is true, setLoading(false) is called (line 20)
  // so children should be rendered
  expect(getByText('content')).toBeVisible();
});

it('calls cleanup function when component unmounts', () => {
  // This covers line 21: return () => requestController.abort();
  const abortSpy = jest.spyOn(AbortController.prototype, 'abort');

  mockUseAuth0CRN.mockReturnValue({
    isAuthenticated: false,
    loading: true, // Auth0 is still loading
    getTokenSilently: jest.fn(),
  } as never);

  const { unmount } = render(
    <RecoilRoot>
      <ContinueOnboarding>content</ContinueOnboarding>
    </RecoilRoot>,
  );

  // Unmount to trigger cleanup
  unmount();

  // Verify abort was called
  expect(abortSpy).toHaveBeenCalled();

  abortSpy.mockRestore();
});

it('returns undefined from useEffect when auth0Loading is false', () => {
  // This covers line 17: return undefined;
  // When auth0Loading is false, the useEffect should return undefined early
  mockUseAuth0CRN.mockReturnValue({
    isAuthenticated: false,
    loading: false, // Auth0 finished loading
    getTokenSilently: jest.fn(),
  } as never);

  const { container } = render(
    <RecoilRoot>
      <ContinueOnboarding>content</ContinueOnboarding>
    </RecoilRoot>,
  );

  // When !auth0Loading is true, useEffect returns undefined early (line 17)
  // setLoading(false) is never called, so loading stays true, returns null
  expect(container.firstChild).toBeNull();
});
