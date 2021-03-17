import { renderHook, act } from '@testing-library/react-hooks';
import { MemoryRouter } from 'react-router-dom';
import { searchQueryParam } from '@asap-hub/routing';
import { waitFor } from '@testing-library/dom';

import { useSearch } from '../search';
import { usePagination, usePaginationParams } from '../pagination';

describe('useSearch', () => {
  describe('property searchQuery', () => {
    it('defaults to empty', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: MemoryRouter,
      });
      expect(result.current.searchQuery).toEqual('');
    });

    it('is taken from the query param', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: MemoryRouter,
        initialProps: {
          initialEntries: [`/test?${searchQueryParam}=test123`],
        },
      });
      expect(result.current.searchQuery).toEqual('test123');
    });

    it('can be changed', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: MemoryRouter,
        initialProps: {
          initialEntries: ['/test'],
        },
      });
      result.current.setSearchQuery('test123');
      expect(result.current.searchQuery).toEqual('test123');
    });

    it('can be removed', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: MemoryRouter,
        initialProps: {
          initialEntries: ['/test?searchQuery=test123'],
        },
      });
      result.current.setSearchQuery('');
      expect(result.current.searchQuery).toEqual('');
    });

    it('resets pagination when changed', () => {
      const { result } = renderHook(
        () => ({
          useSearch: useSearch(),
          usePaginationParams: usePaginationParams(),
          usePagination: usePagination(50, 1),
        }),
        {
          wrapper: MemoryRouter,
          initialProps: {
            initialEntries: ['/test?currentPage=2'],
          },
        },
      );
      expect(result.current.usePaginationParams.currentPage).toBe(2);
      result.current.useSearch.setSearchQuery('test123');
      expect(result.current.usePaginationParams.currentPage).toBe(0);
    });
  });

  describe('property filters', () => {
    it('defaults to empty', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: MemoryRouter,
      });
      expect(result.current.filters).toEqual(new Set());
    });

    it('is taken from the query param', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: MemoryRouter,
        initialProps: {
          initialEntries: ['/test?filter=test123'],
        },
      });
      expect(result.current.filters).toEqual(new Set(['test123']));
    });

    it('can handle multiple filters', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: MemoryRouter,
        initialProps: {
          initialEntries: ['/test?filter=test123&filter=test456'],
        },
      });
      expect(result.current.filters).toEqual(new Set(['test123', 'test456']));
    });

    it('can add a filter', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: MemoryRouter,
        initialProps: {
          initialEntries: ['/test'],
        },
      });
      result.current.toggleFilter('test123');
      expect(result.current.filters).toEqual(new Set(['test123']));
    });

    it('can add multiple filters', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: MemoryRouter,
        initialProps: {
          initialEntries: ['/test'],
        },
      });
      result.current.toggleFilter('test123');
      result.current.toggleFilter('test456');
      expect(result.current.filters).toEqual(new Set(['test123', 'test456']));
    });

    it('can remove a filter', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: MemoryRouter,
        initialProps: {
          initialEntries: ['/test?filter=test123'],
        },
      });
      result.current.toggleFilter('test123');
      expect(result.current.filters).toEqual(new Set());
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
            initialEntries: ['/test?filter=test123&currentPage=2'],
          },
        },
      );
      expect(result.current.usePaginationParams.currentPage).toBe(2);
      result.current.useSearch.toggleFilter('test123');
      expect(result.current.usePaginationParams.currentPage).toBe(0);
    });
  });

  describe('property debouncedSearchQuery', () => {
    it('is the same as the search query initially', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: MemoryRouter,
      });
      expect(result.current.debouncedSearchQuery).toEqual(
        result.current.searchQuery,
      );
    });

    it('remains unchanged immediately after the search query is changed', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: MemoryRouter,
      });
      const { searchQuery } = result.current;

      result.current.setSearchQuery('searchterm');
      expect(result.current.searchQuery).not.toEqual(searchQuery);
      expect(result.current.debouncedSearchQuery).toEqual(searchQuery);
    });
    it('updates to a changed search query after a while', async () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: MemoryRouter,
      });

      result.current.setSearchQuery('searchterm');
      await act(() =>
        waitFor(() =>
          expect(result.current.debouncedSearchQuery).toEqual(
            result.current.searchQuery,
          ),
        ),
      );
    });
  });
});
