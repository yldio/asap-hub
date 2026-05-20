import {
  createInterestGroupResponse,
  createListInterestGroupResponse,
} from '@asap-hub/fixtures';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { ReactNode, Suspense } from 'react';
import { RecoilRoot } from 'recoil';

import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { getInterestGroup, getInterestGroups } from '../api';
import {
  interestGroupQueryKey,
  useInterestGroupById,
  useInterestGroups,
} from '../state';

jest.mock('../api');

const mockGetInterestGroups = getInterestGroups as jest.MockedFunction<
  typeof getInterestGroups
>;
const mockGetInterestGroup = getInterestGroup as jest.MockedFunction<
  typeof getInterestGroup
>;

beforeEach(() => jest.clearAllMocks());

const wrap =
  (
    queryClient: QueryClient,
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

const makeClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: 0 } },
  });

const options = {
  currentPage: 0,
  pageSize: 10,
  filters: new Set<string>(),
  searchQuery: '',
};

describe('useInterestGroups', () => {
  it('fetches the list with a bearer token and returns it', async () => {
    const response = createListInterestGroupResponse(2);
    mockGetInterestGroups.mockResolvedValue(response);

    const { result } = renderHook(() => useInterestGroups(options), {
      wrapper: wrap(makeClient()),
    });

    await waitFor(() => expect(result.current).toEqual(response));
    expect(mockGetInterestGroups).toHaveBeenCalledWith(
      options,
      'Bearer access_token',
    );
  });
});

describe('useInterestGroupById', () => {
  it('returns the group when one is found', async () => {
    const group = createInterestGroupResponse();
    mockGetInterestGroup.mockResolvedValue(group);

    const { result } = renderHook(() => useInterestGroupById('g-1'), {
      wrapper: wrap(makeClient()),
    });

    await waitFor(() => expect(result.current).toEqual(group));
  });

  it('returns undefined when the API resolves with undefined', async () => {
    mockGetInterestGroup.mockResolvedValue(undefined);

    const { result } = renderHook(() => useInterestGroupById('g-missing'), {
      wrapper: wrap(makeClient()),
    });

    await waitFor(() => expect(result.current).toBeUndefined());
  });
});

describe('query keys', () => {
  it('builds a deterministic per-item key', () => {
    expect(interestGroupQueryKey('g-1')).toEqual([
      'interest-groups',
      'item',
      'g-1',
    ]);
  });
});
