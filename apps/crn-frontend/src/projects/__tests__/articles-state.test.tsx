import { createTestQueryClient } from '@asap-hub/frontend-utils';
import type { ListProjectMilestonesResponse, Milestone } from '@asap-hub/model';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { ReactNode, Suspense } from 'react';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import {
  articleQueryKeys,
  useFetchAimArticles,
  useFetchMilestoneArticles,
  useUpdateMilestone,
  useUpdateMilestoneArticles,
} from '../articles-state';
import { projectMilestoneQueryKeys } from '../state';
import type { MilestonesListOptions } from '../api';

const mockGetAimArticles = jest.fn();
const mockGetMilestoneArticles = jest.fn();
const mockPutMilestoneArticles = jest.fn();
const mockPatchMilestone = jest.fn();

jest.mock('../api', () => ({
  ...jest.requireActual('../api'),
  getAimArticles: (...args: unknown[]) => mockGetAimArticles(...args),
  getMilestoneArticles: (...args: unknown[]) =>
    mockGetMilestoneArticles(...args),
  putMilestoneArticles: (...args: unknown[]) =>
    mockPutMilestoneArticles(...args),
  patchMilestone: (...args: unknown[]) => mockPatchMilestone(...args),
}));

const mockAuthorization = 'Bearer access_token';

const milestonesOptions: MilestonesListOptions = {
  projectId: 'proj-1',
  grantType: 'supplement',
  searchQuery: '',
  filters: new Set<string>(),
  currentPage: 0,
  pageSize: 10,
};

const createWrapper =
  (queryClient: QueryClient) =>
  ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>{children}</WhenReady>
        </Auth0Provider>
      </Suspense>
    </QueryClientProvider>
  );

const renderArticlesHook = <T,>(hook: () => T, queryClient?: QueryClient) => {
  const client = queryClient ?? createTestQueryClient();
  const utils = renderHook(hook, { wrapper: createWrapper(client) });
  return { ...utils, queryClient: client };
};

const seedMilestoneList = (queryClient: QueryClient, milestone: Milestone) => {
  queryClient.setQueryData<ListProjectMilestonesResponse>(
    projectMilestoneQueryKeys.list(milestonesOptions),
    { total: 1, items: [milestone] },
  );
};

const getCachedMilestone = (queryClient: QueryClient, milestoneId: string) =>
  queryClient
    .getQueryData<ListProjectMilestonesResponse>(
      projectMilestoneQueryKeys.list(milestonesOptions),
    )
    ?.items.find(({ id }) => id === milestoneId);

describe('aim-articles-state', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('useFetchAimArticles', () => {
    it('calls getAimArticles with the aimId and authorization, updates the cache, and returns the list', async () => {
      const mockArticles = [
        { id: 'ro-1', title: 'Article One', href: '/shared-research/ro-1' },
      ];
      mockGetAimArticles.mockResolvedValueOnce(mockArticles);

      const { result, queryClient } = renderArticlesHook(() =>
        useFetchAimArticles(),
      );

      await waitFor(() => expect(result.current).toBeTruthy());
      const articles = await act(async () => result.current('aim-1'));

      expect(articles).toEqual(mockArticles);
      expect(mockGetAimArticles).toHaveBeenCalledWith(
        'aim-1',
        mockAuthorization,
      );
      expect(queryClient.getQueryData(articleQueryKeys.aim('aim-1'))).toEqual(
        mockArticles,
      );
    });

    it('returns empty array and sets the cache when the API returns no articles', async () => {
      mockGetAimArticles.mockResolvedValueOnce([]);

      const { result } = renderArticlesHook(() => useFetchAimArticles());

      await waitFor(() => expect(result.current).toBeTruthy());
      const articles = await act(async () => result.current('aim-empty'));

      expect(articles).toEqual([]);
    });

    it('returns cached articles without calling the API on subsequent fetches', async () => {
      const mockArticles = [
        { id: 'ro-1', title: 'Article One', href: '/shared-research/ro-1' },
      ];
      mockGetAimArticles.mockResolvedValueOnce(mockArticles);

      const { result } = renderArticlesHook(() => useFetchAimArticles());

      await waitFor(() => expect(result.current).toBeTruthy());
      await act(async () => result.current('aim-cached'));
      const cachedArticles = await act(async () =>
        result.current('aim-cached'),
      );

      expect(cachedArticles).toEqual(mockArticles);
      expect(mockGetAimArticles).toHaveBeenCalledTimes(1);
    });
  });

  describe('useFetchMilestoneArticles', () => {
    it('calls getMilestoneArticles with the milestoneId and authorization, updates the cache, and returns the list', async () => {
      const mockArticles = [
        { id: 'ro-1', title: 'Article One', href: '/shared-research/ro-1' },
      ];
      mockGetMilestoneArticles.mockResolvedValueOnce(mockArticles);

      const { result, queryClient } = renderArticlesHook(() =>
        useFetchMilestoneArticles(),
      );

      await waitFor(() => expect(result.current).toBeTruthy());
      const articles = await act(async () => result.current('milestone-1'));

      expect(articles).toEqual(mockArticles);
      expect(mockGetMilestoneArticles).toHaveBeenCalledWith(
        'milestone-1',
        mockAuthorization,
      );
      expect(
        queryClient.getQueryData(articleQueryKeys.milestone('milestone-1')),
      ).toEqual(mockArticles);
    });

    it('returns empty array and sets the cache when the API returns no articles', async () => {
      mockGetMilestoneArticles.mockResolvedValueOnce([]);

      const { result } = renderArticlesHook(() => useFetchMilestoneArticles());

      await waitFor(() => expect(result.current).toBeTruthy());
      const articles = await act(async () => result.current('milestone-empty'));

      expect(articles).toEqual([]);
    });

    it('returns cached articles without calling the API on subsequent fetches', async () => {
      const mockArticles = [
        { id: 'ro-1', title: 'Article One', href: '/shared-research/ro-1' },
      ];
      mockGetMilestoneArticles.mockResolvedValueOnce(mockArticles);

      const { result } = renderArticlesHook(() => useFetchMilestoneArticles());

      await waitFor(() => expect(result.current).toBeTruthy());
      await act(async () => result.current('milestone-cached'));
      const cachedArticles = await act(async () =>
        result.current('milestone-cached'),
      );

      expect(cachedArticles).toEqual(mockArticles);
      expect(mockGetMilestoneArticles).toHaveBeenCalledTimes(1);
    });
  });

  describe('useUpdateMilestoneArticles', () => {
    const mockArticles = [
      { id: 'ro-1', title: 'Article One', href: '/shared-research/ro-1' },
      { id: 'ro-2', title: 'Article Two', href: '/shared-research/ro-2' },
    ];

    const mockMilestone: Milestone = {
      id: 'milestone-1',
      description: 'Test milestone',
      status: 'In Progress',
      articleCount: 0,
    };

    it('calls putMilestoneArticles with milestoneId, article ids, and authorization', async () => {
      mockPutMilestoneArticles.mockResolvedValueOnce(undefined);

      const { result } = renderArticlesHook(() => useUpdateMilestoneArticles());

      await waitFor(() => expect(result.current).toBeTruthy());
      await act(async () => {
        await result.current('milestone-1', mockArticles);
      });

      expect(mockPutMilestoneArticles).toHaveBeenCalledWith(
        'milestone-1',
        ['ro-1', 'ro-2'],
        mockAuthorization,
      );
    });

    it('updates the milestone articles cache after a successful save', async () => {
      mockPutMilestoneArticles.mockResolvedValueOnce(undefined);

      const { result, queryClient } = renderArticlesHook(() =>
        useUpdateMilestoneArticles(),
      );

      expect(
        queryClient.getQueryData(articleQueryKeys.milestone('milestone-2')),
      ).toBeUndefined();

      await waitFor(() => expect(result.current).toBeTruthy());
      await act(async () => {
        await result.current('milestone-2', mockArticles);
      });

      expect(
        queryClient.getQueryData(articleQueryKeys.milestone('milestone-2')),
      ).toEqual(mockArticles);
    });

    it('updates the cached milestone list articleCount when the milestone is cached', async () => {
      mockPutMilestoneArticles.mockResolvedValueOnce(undefined);

      const queryClient = createTestQueryClient();
      seedMilestoneList(queryClient, { ...mockMilestone, id: 'milestone-3' });

      const { result } = renderArticlesHook(
        () => useUpdateMilestoneArticles(),
        queryClient,
      );

      await waitFor(() => expect(result.current).toBeTruthy());
      await act(async () => {
        await result.current('milestone-3', mockArticles);
      });

      expect(getCachedMilestone(queryClient, 'milestone-3')).toMatchObject({
        articleCount: 2,
      });
    });

    it('does not modify cached milestone lists when the milestone is not cached', async () => {
      mockPutMilestoneArticles.mockResolvedValueOnce(undefined);

      const queryClient = createTestQueryClient();
      seedMilestoneList(queryClient, mockMilestone);

      const { result } = renderArticlesHook(
        () => useUpdateMilestoneArticles(),
        queryClient,
      );

      await waitFor(() => expect(result.current).toBeTruthy());
      await act(async () => {
        await result.current('milestone-4', mockArticles);
      });

      expect(getCachedMilestone(queryClient, 'milestone-4')).toBeUndefined();
      expect(getCachedMilestone(queryClient, 'milestone-1')).toEqual(
        mockMilestone,
      );
    });

    it('propagates errors from putMilestoneArticles', async () => {
      mockPutMilestoneArticles.mockRejectedValueOnce(new Error('save failed'));

      const { result } = renderArticlesHook(() => useUpdateMilestoneArticles());

      await waitFor(() => expect(result.current).toBeTruthy());
      await expect(
        act(async () => {
          await result.current('milestone-5', mockArticles);
        }),
      ).rejects.toThrow('save failed');
    });
  });

  describe('useUpdateMilestone', () => {
    const mockArticles = [
      { id: 'ro-1', title: 'Article One', href: '/shared-research/ro-1' },
    ];

    const mockMilestone: Milestone = {
      id: 'milestone-7',
      description: 'Test milestone',
      status: 'In Progress',
      articleCount: 0,
    };

    it('calls patchMilestone with status only when articles are not provided', async () => {
      mockPatchMilestone.mockResolvedValueOnce(undefined);

      const { result } = renderArticlesHook(() => useUpdateMilestone());

      await waitFor(() => expect(result.current).toBeTruthy());
      await act(async () => {
        await result.current('milestone-7', {
          status: 'Complete',
        });
      });

      expect(mockPatchMilestone).toHaveBeenCalledWith(
        'milestone-7',
        { status: 'Complete' },
        mockAuthorization,
      );
    });

    it('calls patchMilestone with status and articleIds when articles are provided', async () => {
      mockPatchMilestone.mockResolvedValueOnce(undefined);

      const { result } = renderArticlesHook(() => useUpdateMilestone());

      await waitFor(() => expect(result.current).toBeTruthy());
      await act(async () => {
        await result.current('milestone-7', {
          status: 'Complete',
          articles: mockArticles,
        });
      });

      expect(mockPatchMilestone).toHaveBeenCalledWith(
        'milestone-7',
        { status: 'Complete', articleIds: ['ro-1'] },
        mockAuthorization,
      );
    });

    it('updates the cached milestone status and articleCount on success', async () => {
      mockPatchMilestone.mockResolvedValueOnce(undefined);

      const queryClient = createTestQueryClient();
      seedMilestoneList(queryClient, mockMilestone);

      const { result } = renderArticlesHook(
        () => useUpdateMilestone(),
        queryClient,
      );

      await waitFor(() => expect(result.current).toBeTruthy());
      await act(async () => {
        await result.current('milestone-7', {
          status: 'Complete',
          articles: mockArticles,
        });
      });

      expect(getCachedMilestone(queryClient, 'milestone-7')).toMatchObject({
        status: 'Complete',
        articleCount: 1,
      });
      expect(
        queryClient.getQueryData(articleQueryKeys.milestone('milestone-7')),
      ).toEqual(mockArticles);
    });
  });
});
