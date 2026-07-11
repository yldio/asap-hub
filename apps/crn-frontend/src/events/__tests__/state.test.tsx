import { createTestQueryClient } from '@asap-hub/frontend-utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, renderHook, waitFor } from '@testing-library/react';
import { Component, ReactNode, Suspense } from 'react';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getEvent, getEvents } from '../api';
import {
  eventQueryKeys,
  useEventById,
  useEvents,
  useQuietRefreshEventById,
} from '../state';

jest.mock('../api', () => ({
  getEvent: jest.fn(),
  getEvents: jest.fn(),
}));

jest.mock('../../hooks/algolia', () => ({
  useAlgolia: jest.fn(() => ({ client: {} })),
}));

const mockAuthorization = 'Bearer access_token';

const createWrapper =
  (queryClient: QueryClient) =>
  ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback="loading">
        <Auth0Provider user={{ id: 'user-id' }}>
          <WhenReady>{children}</WhenReady>
        </Auth0Provider>
      </Suspense>
    </QueryClientProvider>
  );

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? 'errored' : this.props.children;
  }
}

const renderStateHook = <T,>(hook: () => T) => {
  const queryClient = createTestQueryClient();
  const utils = renderHook(hook, { wrapper: createWrapper(queryClient) });
  return { ...utils, queryClient };
};

const listOptions = {
  searchQuery: '',
  currentPage: 0,
  pageSize: 10,
} as unknown as Parameters<typeof useEvents>[0];

afterEach(() => {
  jest.clearAllMocks();
});

describe('useEventById', () => {
  it('maps a 404 (undefined) to undefined and caches null', async () => {
    (getEvent as jest.Mock).mockResolvedValue(undefined);

    const { result, queryClient } = renderStateHook(() =>
      useEventById('missing-event'),
    );

    await waitFor(() => expect(getEvent).toHaveBeenCalled());
    await waitFor(() =>
      expect(
        queryClient.getQueryData(eventQueryKeys.detail('missing-event')),
      ).toBeNull(),
    );
    expect(result.current).toBeUndefined();
  });
});

describe('useQuietRefreshEventById', () => {
  it('caches null when the event no longer exists', async () => {
    (getEvent as jest.Mock).mockResolvedValue(undefined);

    const { result, queryClient } = renderStateHook(() =>
      useQuietRefreshEventById('event-id'),
    );
    await waitFor(() => expect(result.current).toBeTruthy());

    await act(async () => {
      await result.current();
    });

    expect(getEvent).toHaveBeenCalledWith('event-id', mockAuthorization);
    expect(
      queryClient.getQueryData(eventQueryKeys.detail('event-id')),
    ).toBeNull();
  });
});

describe('useEvents', () => {
  it('maps a non-Error rejection to an empty list', async () => {
    (getEvents as jest.Mock).mockRejectedValue('string rejection');

    const { result } = renderStateHook(() => useEvents(listOptions));

    await waitFor(() =>
      expect(result.current).toEqual({ total: 0, items: [] }),
    );
  });

  it('re-throws Error rejections to the error boundary', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    (getEvents as jest.Mock).mockRejectedValue(new Error('boom'));

    const queryClient = createTestQueryClient();
    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <Suspense fallback="loading">
            <Auth0Provider user={{ id: 'user-id' }}>
              <WhenReady>
                <EventsProbe />
              </WhenReady>
            </Auth0Provider>
          </Suspense>
        </ErrorBoundary>
      </QueryClientProvider>,
    );

    await waitFor(() => expect(getByText('errored')).toBeInTheDocument());
    consoleErrorSpy.mockRestore();
  });
});

const EventsProbe = () => {
  useEvents(listOptions);
  return <>rendered</>;
};
