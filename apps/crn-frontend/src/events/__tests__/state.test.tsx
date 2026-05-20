import {
  createEventResponse,
  createListEventResponse,
} from '@asap-hub/fixtures';
import { getEventListOptions } from '@asap-hub/frontend-utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { ReactNode, Suspense } from 'react';
import { RecoilRoot } from 'recoil';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { useAlgolia } from '../../hooks/algolia';
import { getEvent, getEvents } from '../api';
import { useEventById, useEvents, useQuietRefreshEventById } from '../state';

jest.mock('../api');
jest.mock('../../hooks/algolia', () => ({ useAlgolia: jest.fn() }));

const mockGetEvents = getEvents as jest.MockedFunction<typeof getEvents>;
const mockGetEvent = getEvent as jest.MockedFunction<typeof getEvent>;
const mockedUseAlgolia = useAlgolia as jest.MockedFunction<typeof useAlgolia>;

beforeEach(() => {
  jest.clearAllMocks();
  mockedUseAlgolia.mockReturnValue({
    // Cast to bypass strict type — the queryFn only forwards the value.
    client: {} as unknown as ReturnType<typeof useAlgolia>['client'],
  });
});

const wrap =
  (
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: 0 } },
    }),
  ): ((props: { children: ReactNode }) => JSX.Element) =>
  ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <Auth0Provider user={{}}>
          <WhenReady>
            <Suspense fallback={<span>loading</span>}>{children}</Suspense>
          </WhenReady>
        </Auth0Provider>
      </RecoilRoot>
    </QueryClientProvider>
  );

const baseOptions = getEventListOptions(new Date('2024-01-01'), {
  past: false,
});

describe('useEvents', () => {
  it('returns the algolia list response on success', async () => {
    const response = createListEventResponse(2);
    mockGetEvents.mockResolvedValue(response);

    const { result } = renderHook(() => useEvents(baseOptions), {
      wrapper: wrap(),
    });

    await waitFor(() => expect(result.current).toEqual(response));
  });

  it('returns an empty list when the API rejects with a non-Error value', async () => {
    mockGetEvents.mockRejectedValue(undefined as unknown as Error);

    const { result } = renderHook(() => useEvents(baseOptions), {
      wrapper: wrap(),
    });

    await waitFor(() =>
      expect(result.current).toEqual({ total: 0, items: [] }),
    );
  });
});

describe('useEventById', () => {
  it('returns the event when one is found', async () => {
    const event = createEventResponse();
    mockGetEvent.mockResolvedValue(event);

    const { result } = renderHook(() => useEventById('evt-1'), {
      wrapper: wrap(),
    });

    await waitFor(() => expect(result.current).toEqual(event));
  });

  it('returns undefined when the API resolves with undefined', async () => {
    mockGetEvent.mockResolvedValue(undefined);

    const { result } = renderHook(() => useEventById('evt-missing'), {
      wrapper: wrap(),
    });

    await waitFor(() => expect(result.current).toBeUndefined());
  });
});

describe('useQuietRefreshEventById', () => {
  it('refetches the event and writes the result into the query cache', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: 0 } },
    });
    const event = createEventResponse();
    mockGetEvent.mockResolvedValue(event);

    const { result } = renderHook(() => useQuietRefreshEventById('evt-2'), {
      wrapper: wrap(queryClient),
    });

    await waitFor(() => expect(typeof result.current).toBe('function'));
    await result.current();

    expect(queryClient.getQueryData(['events', 'item', 'evt-2'])).toEqual(
      event,
    );
  });
});
