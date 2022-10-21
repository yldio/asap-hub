import { renderHook } from '@testing-library/react-hooks';
import { MemoryRouter } from 'react-router-dom';
import { usePagination, usePaginationParams } from '../pagination';
import { useSearch } from '../search';

describe('useSearch', () => {
  describe('property filters', () => {
    it('defaults to empty', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: MemoryRouter,
      });
      expect(result.current.filters).toEqual({ region: [] });
    });

    it('is taken from the query param', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: MemoryRouter,
        initialProps: {
          initialEntries: ['/test?region=Asia'],
        },
      });
      expect(result.current.filters).toEqual({ region: ['Asia'] });
    });

    it('can handle multiple filters', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: MemoryRouter,
        initialProps: {
          initialEntries: ['/test?region=Asia&region=Europe'],
        },
      });
      expect(result.current.filters).toEqual({ region: ['Asia', 'Europe'] });
    });

    it('can add a filter', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: MemoryRouter,
        initialProps: {
          initialEntries: ['/test'],
        },
      });
      result.current.updateFilters('/test', { region: ['Europe'] });
      expect(result.current.filters).toEqual({ region: ['Europe'] });
    });

    it('can add multiple filters', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: MemoryRouter,
        initialProps: {
          initialEntries: ['/test'],
        },
      });
      result.current.updateFilters('/test', { region: ['Europe', 'Asia'] });
      expect(result.current.filters).toEqual({ region: ['Europe', 'Asia'] });
    });

    it('can remove a filter', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: MemoryRouter,
        initialProps: {
          initialEntries: ['/test?region=Europe'],
        },
      });
      result.current.updateFilters('/test', { region: ['Europe', 'Asia'] });
      expect(result.current.filters).toEqual({ region: ['Europe', 'Asia'] });
    });

    it('resets the pagination when changed', () => {
      const { result } = renderHook(
        () => ({
          useSearch: useSearch(),
          usePaginationParams: usePaginationParams(),
          usePagination: usePagination(50, 1),
        }),
        {
          wrapper: MemoryRouter,
          initialProps: {
            initialEntries: ['/test?region=Europe&currentPage=2'],
          },
        },
      );
      expect(result.current.usePaginationParams.currentPage).toBe(2);
      result.current.useSearch.updateFilters('/test', { region: [] });
      expect(result.current.usePaginationParams.currentPage).toBe(0);
    });
  });
});
