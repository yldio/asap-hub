import { waitFor } from '@testing-library/dom';
import { act, renderHook } from '@testing-library/react';
import { RecoilRoot, useRecoilValue } from 'recoil';
import { aimArticlesState, useFetchArticles } from '../aim-articles-state';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <RecoilRoot>{children}</RecoilRoot>
);

/** Hook that uses both useFetchArticles and aimArticlesState under one RecoilRoot so state updates are visible. */
function useFetchAndState(aimId: string) {
  const fetchArticles = useFetchArticles();
  const articles = useRecoilValue(aimArticlesState(aimId));
  return { fetchArticles, articles };
}

describe('aim-articles-state', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('useFetchArticles', () => {
    it('fetches articles for an aim, updates Recoil state, and returns the list', async () => {
      const { result } = renderHook(() => useFetchArticles(), { wrapper });

      let resolvedArticles: readonly { id: string; title: string; href: string }[] = [];
      act(() => {
        result.current('aim-1').then((articles) => {
          resolvedArticles = articles;
        });
      });

      await act(async () => {
        jest.runAllTimers();
      });

      await act(async () => {
        await Promise.resolve();
      });

      expect(resolvedArticles).toHaveLength(3);
      expect(resolvedArticles[0]).toMatchObject({
        id: 'art-1-1',
        title: 'Alpha-synuclein aggregation in dopaminergic neurons',
        href: '#',
      });
    });

    it('returns empty array and sets state for unknown aim id', async () => {
      const { result } = renderHook(() => useFetchArticles(), { wrapper });

      let resolvedArticles: readonly unknown[] = [];
      act(() => {
        result.current('unknown-aim').then((articles) => {
          resolvedArticles = articles;
        });
      });

      await act(async () => {
        jest.runAllTimers();
      });

      await act(async () => {
        await Promise.resolve();
      });

      expect(resolvedArticles).toEqual([]);
    });
  });

  describe('aimArticlesState', () => {
    it('is updated when useFetchArticles fetch completes', async () => {
      const { result } = renderHook(() => useFetchAndState('aim-2'), {
        wrapper,
      });

      expect(result.current.articles).toBeUndefined();

      act(() => {
        result.current.fetchArticles('aim-2');
      });

      await act(async () => {
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(result.current.articles).toHaveLength(1);
      });

      expect(result.current.articles?.[0]).toMatchObject({
        id: 'art-2-1',
        title: 'Computational models for protein misfolding prediction',
        href: '#',
      });
    });
  });
});
