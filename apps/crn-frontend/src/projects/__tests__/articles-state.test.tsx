import { waitFor } from '@testing-library/dom';
import { act, renderHook } from '@testing-library/react';
import { RecoilRoot, useRecoilValue } from 'recoil';
import type { Milestone } from '@asap-hub/model';
import {
  aimArticlesState,
  milestoneArticlesState,
  useFetchAimArticles,
  useFetchMilestoneArticles,
  useUpdateMilestoneArticles,
} from '../articles-state';
import { projectMilestonesListItemState } from '../state';

const mockGetAimArticles = jest.fn();
const mockGetMilestoneArticles = jest.fn();
const mockPutMilestoneArticles = jest.fn();

jest.mock('../api', () => ({
  ...jest.requireActual('../api'),
  getAimArticles: (...args: unknown[]) => mockGetAimArticles(...args),
  getMilestoneArticles: (...args: unknown[]) =>
    mockGetMilestoneArticles(...args),
  putMilestoneArticles: (...args: unknown[]) =>
    mockPutMilestoneArticles(...args),
}));

jest.mock('../../auth/state', () => ({
  authorizationState: jest.requireActual('recoil').atom({
    key: 'authorizationState-test',
    default: 'Bearer test-token',
  }),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <RecoilRoot>{children}</RecoilRoot>
);

function useFetchAndState(aimId: string) {
  const fetchArticles = useFetchAimArticles();
  const articles = useRecoilValue(aimArticlesState(aimId));
  return { fetchArticles, articles };
}

describe('aim-articles-state', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('useFetchAimArticles', () => {
    it('calls getAimArticles with the aimId and authorization, updates Recoil state, and returns the list', async () => {
      const mockArticles = [
        { id: 'ro-1', title: 'Article One', href: '/shared-research/ro-1' },
      ];
      mockGetAimArticles.mockResolvedValueOnce(mockArticles);

      const { result } = renderHook(() => useFetchAimArticles(), { wrapper });

      const articles = await act(async () => result.current('aim-1'));

      expect(articles).toEqual(mockArticles);
      expect(mockGetAimArticles).toHaveBeenCalledWith(
        'aim-1',
        'Bearer test-token',
      );
    });

    it('returns empty array and sets state when API returns no articles', async () => {
      mockGetAimArticles.mockResolvedValueOnce([]);

      const { result } = renderHook(() => useFetchAimArticles(), { wrapper });

      const articles = await act(async () => result.current('aim-empty'));

      expect(articles).toEqual([]);
    });

    it('returns cached articles without calling the API on subsequent fetches', async () => {
      const mockArticles = [
        { id: 'ro-1', title: 'Article One', href: '/shared-research/ro-1' },
      ];
      mockGetAimArticles.mockResolvedValueOnce(mockArticles);

      const { result } = renderHook(() => useFetchAimArticles(), { wrapper });

      await act(async () => result.current('aim-cached'));
      const cachedArticles = await act(async () =>
        result.current('aim-cached'),
      );

      expect(cachedArticles).toEqual(mockArticles);
      expect(mockGetAimArticles).toHaveBeenCalledTimes(1);
    });
  });

  describe('useFetchMilestoneArticles', () => {
    it('calls getMilestoneArticles with the milestoneId and authorization, updates Recoil state, and returns the list', async () => {
      const mockArticles = [
        { id: 'ro-1', title: 'Article One', href: '/shared-research/ro-1' },
      ];
      mockGetMilestoneArticles.mockResolvedValueOnce(mockArticles);

      const { result } = renderHook(() => useFetchMilestoneArticles(), {
        wrapper,
      });

      const articles = await act(async () => result.current('milestone-1'));

      expect(articles).toEqual(mockArticles);
      expect(mockGetMilestoneArticles).toHaveBeenCalledWith(
        'milestone-1',
        'Bearer test-token',
      );
    });

    it('returns empty array and sets state when API returns no articles', async () => {
      mockGetMilestoneArticles.mockResolvedValueOnce([]);

      const { result } = renderHook(() => useFetchMilestoneArticles(), {
        wrapper,
      });

      const articles = await act(async () => result.current('milestone-empty'));

      expect(articles).toEqual([]);
    });

    it('returns cached articles without calling the API on subsequent fetches', async () => {
      const mockArticles = [
        { id: 'ro-1', title: 'Article One', href: '/shared-research/ro-1' },
      ];
      mockGetMilestoneArticles.mockResolvedValueOnce(mockArticles);

      const { result } = renderHook(() => useFetchMilestoneArticles(), {
        wrapper,
      });

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

    function useUpdateAndRead(milestoneId: string) {
      const updateArticles = useUpdateMilestoneArticles();
      const cachedArticles = useRecoilValue(milestoneArticlesState(milestoneId));
      const cachedMilestone = useRecoilValue(
        projectMilestonesListItemState(milestoneId),
      );
      return { updateArticles, cachedArticles, cachedMilestone };
    }

    it('calls putMilestoneArticles with milestoneId, article ids, and authorization', async () => {
      mockPutMilestoneArticles.mockResolvedValueOnce(undefined);

      const { result } = renderHook(
        () => useUpdateAndRead('milestone-1'),
        { wrapper },
      );

      await act(async () => {
        await result.current.updateArticles('milestone-1', mockArticles);
      });

      expect(mockPutMilestoneArticles).toHaveBeenCalledWith(
        'milestone-1',
        ['ro-1', 'ro-2'],
        'Bearer test-token',
      );
    });

    it('updates milestoneArticlesState after a successful save', async () => {
      mockPutMilestoneArticles.mockResolvedValueOnce(undefined);

      const { result } = renderHook(
        () => useUpdateAndRead('milestone-2'),
        { wrapper },
      );

      expect(result.current.cachedArticles).toBeUndefined();

      await act(async () => {
        await result.current.updateArticles('milestone-2', mockArticles);
      });

      await waitFor(() => {
        expect(result.current.cachedArticles).toEqual(mockArticles);
      });
    });

    it('updates projectMilestonesListItemState articleCount when milestone is cached', async () => {
      mockPutMilestoneArticles.mockResolvedValueOnce(undefined);

      const wrapperWithMilestone = ({
        children,
      }: {
        children: React.ReactNode;
      }) => (
        <RecoilRoot
          initializeState={(snap) => {
            snap.set(projectMilestonesListItemState('milestone-3'), mockMilestone);
          }}
        >
          {children}
        </RecoilRoot>
      );

      const { result } = renderHook(
        () => useUpdateAndRead('milestone-3'),
        { wrapper: wrapperWithMilestone },
      );

      await act(async () => {
        await result.current.updateArticles('milestone-3', mockArticles);
      });

      await waitFor(() => {
        expect(result.current.cachedMilestone).toMatchObject({
          articleCount: 2,
        });
      });
    });

    it('does not modify projectMilestonesListItemState when milestone is not cached', async () => {
      mockPutMilestoneArticles.mockResolvedValueOnce(undefined);

      const { result } = renderHook(
        () => useUpdateAndRead('milestone-4'),
        { wrapper },
      );

      await act(async () => {
        await result.current.updateArticles('milestone-4', mockArticles);
      });

      expect(result.current.cachedMilestone).toBeUndefined();
    });

    it('propagates errors from putMilestoneArticles', async () => {
      mockPutMilestoneArticles.mockRejectedValueOnce(new Error('save failed'));

      const { result } = renderHook(() => useUpdateMilestoneArticles(), {
        wrapper,
      });

      await expect(
        act(async () => {
          await result.current('milestone-5', mockArticles);
        }),
      ).rejects.toThrow('save failed');
    });
  });

  describe('aimArticlesState', () => {
    it('is updated after useFetchArticles resolves', async () => {
      const mockArticles = [
        { id: 'ro-2', title: 'Article Two', href: '/shared-research/ro-2' },
      ];
      mockGetAimArticles.mockResolvedValueOnce(mockArticles);

      const { result } = renderHook(() => useFetchAndState('aim-2'), {
        wrapper,
      });

      expect(result.current.articles).toBeUndefined();

      await act(async () => {
        await result.current.fetchArticles('aim-2');
      });

      await waitFor(() => {
        expect(result.current.articles).toEqual(mockArticles);
      });
    });
  });
});
