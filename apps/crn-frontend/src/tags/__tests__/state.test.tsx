import {
  AlgoliaSearchClient,
  createAlgoliaResponse,
  EMPTY_ALGOLIA_RESPONSE,
} from '@asap-hub/algolia';
import { createUserListItemResponse } from '@asap-hub/fixtures';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { ReactNode, Suspense } from 'react';

import { useAlgolia } from '../../hooks/algolia';
import { getTagSearch } from '../api';
import { useTagSearch } from '../state';

jest.mock('../api');
jest.mock('../../hooks/algolia', () => ({ useAlgolia: jest.fn() }));

const mockGetTagSearch = getTagSearch as jest.MockedFunction<
  typeof getTagSearch
>;
const mockedUseAlgolia = useAlgolia as jest.MockedFunction<typeof useAlgolia>;

beforeEach(() => {
  jest.clearAllMocks();
  mockedUseAlgolia.mockReturnValue({
    client: {} as unknown as AlgoliaSearchClient<'crn'>,
  });
});

const wrap = (): ((props: { children: ReactNode }) => JSX.Element) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: 0 } },
  });
  return ({ children }) => (
    <QueryClientProvider client={client}>
      <Suspense fallback={<span>loading</span>}>{children}</Suspense>
    </QueryClientProvider>
  );
};

describe('useTagSearch', () => {
  it('returns the empty response without calling the API when there is no query or tags', async () => {
    const { result } = renderHook(
      () =>
        useTagSearch(['user'], {
          searchQuery: '',
          tags: [],
          currentPage: 0,
          pageSize: 10,
        }),
      { wrapper: wrap() },
    );

    await waitFor(() => expect(result.current).toEqual(EMPTY_ALGOLIA_RESPONSE));
    expect(mockGetTagSearch).not.toHaveBeenCalled();
  });

  it('maps an algolia response into a list response', async () => {
    const user = createUserListItemResponse();
    mockGetTagSearch.mockResolvedValue(
      createAlgoliaResponse<'crn', 'user'>([
        { ...user, objectID: user.id, __meta: { type: 'user' } },
      ]),
    );

    const { result } = renderHook(
      () =>
        useTagSearch(['user'], {
          searchQuery: 'john',
          tags: [],
          currentPage: 0,
          pageSize: 10,
        }),
      { wrapper: wrap() },
    );

    await waitFor(() => expect(result.current.items).toHaveLength(1));
    expect(result.current.total).toBe(1);
  });

  it('swallows non-Error rejections by returning the empty response', async () => {
    mockGetTagSearch.mockRejectedValue(undefined);

    const { result } = renderHook(
      () =>
        useTagSearch(['user'], {
          searchQuery: 'oops',
          tags: [],
          currentPage: 0,
          pageSize: 10,
        }),
      { wrapper: wrap() },
    );

    await waitFor(() => expect(result.current).toEqual(EMPTY_ALGOLIA_RESPONSE));
  });
});
