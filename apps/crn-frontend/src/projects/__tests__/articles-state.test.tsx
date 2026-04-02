import { waitFor } from '@testing-library/dom';
import { act, renderHook } from '@testing-library/react';
import { RecoilRoot, useRecoilValue } from 'recoil';
import { aimArticlesState, useFetchAimArticles } from '../articles-state';

const mockGetAimArticles = jest.fn();

jest.mock('../api', () => ({
  ...jest.requireActual('../api'),
  getAimArticles: (...args: unknown[]) => mockGetAimArticles(...args),
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
