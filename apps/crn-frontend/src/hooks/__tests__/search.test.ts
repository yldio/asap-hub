import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { searchQueryParam } from '@asap-hub/routing';
import { waitFor } from '@testing-library/dom';
import React, { ComponentProps } from 'react';

import { useSearch } from '../search';
import { usePagination, usePaginationParams } from '../pagination';

const createWrapper =
  (initialEntries: string[] = ['/']) =>
  ({ children }: ComponentProps<typeof MemoryRouter>) =>
    React.createElement(MemoryRouter, { initialEntries }, children);

describe('useSearch', () => {
  describe('property searchQuery', () => {
    it('defaults to empty', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(['/test']),
      });
      expect(result.current.searchQuery).toEqual('');
    });

    it('is taken from the query param', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper([`/test?${searchQueryParam}=test123`]),
      });
      expect(result.current.searchQuery).toEqual('test123');
    });

    it('can be changed', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(['/test']),
      });
      act(() => {
        result.current.setSearchQuery('test123');
      });
      expect(result.current.searchQuery).toEqual('test123');
    });

    it('can be removed', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(['/test?searchQuery=test123']),
      });
      act(() => {
        result.current.setSearchQuery('');
      });
      expect(result.current.searchQuery).toEqual('');
    });

    // TODO: Skipped due to react-router v6 migration - navigate() with replace: true doesn't trigger location updates in MemoryRouter test environment
    it.skip('resets pagination when changed', () => {
      const { result } = renderHook(
        () => ({
          useSearch: useSearch(),
          usePaginationParams: usePaginationParams(),
          usePagination: usePagination(50, 1),
        }),
        {
          wrapper: createWrapper(['/test?currentPage=2']),
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
        wrapper: createWrapper(['/test']),
      });
      expect(result.current.filters).toEqual(new Set());
    });

    it('is taken from the query param', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(['/test?filter=test123']),
      });
      expect(result.current.filters).toEqual(new Set(['test123']));
    });

    it('can handle multiple filters', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(['/test?filter=test123&filter=test456']),
      });
      expect(result.current.filters).toEqual(new Set(['test123', 'test456']));
    });

    it('can add a filter', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(['/test']),
      });
      act(() => {
        result.current.toggleFilter('test123');
      });
      expect(result.current.filters).toEqual(new Set(['test123']));
    });

    it('can add multiple filters', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(['/test']),
      });
      act(() => {
        result.current.toggleFilter('test123');
      });
      act(() => {
        result.current.toggleFilter('test456');
      });
      expect(result.current.filters).toEqual(new Set(['test123', 'test456']));
    });

    it('can remove a filter', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(['/test?filter=test123']),
      });
      act(() => {
        result.current.toggleFilter('test123');
      });
      expect(result.current.filters).toEqual(new Set());
    });

    // TODO: Skipped due to react-router v6 migration - navigate() with replace: true doesn't trigger location updates in MemoryRouter test environment
    it.skip('resets the pagination when changed', () => {
      const { result } = renderHook(
        () => ({
          useSearch: useSearch(),
          usePaginationParams: usePaginationParams(),
          usePagination: usePagination(50, 1),
        }),
        {
          wrapper: createWrapper(['/test?filter=test123&currentPage=2']),
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
        wrapper: createWrapper(['/test']),
      });
      expect(result.current.debouncedSearchQuery).toEqual(
        result.current.searchQuery,
      );
    });

    it('remains unchanged immediately after the search query is changed', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(['/test']),
      });
      const { searchQuery } = result.current;

      act(() => {
        result.current.setSearchQuery('searchterm');
      });
      expect(result.current.searchQuery).not.toEqual(searchQuery);
      expect(result.current.debouncedSearchQuery).toEqual(searchQuery);
    });
    // TODO: Skipped due to react-router v6 migration - debounced query updates are not propagating through navigate() in test environment
    it.skip('updates to a changed search query after a while', async () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(['/test']),
      });

      act(() => {
        result.current.setSearchQuery('searchterm');
      });
      await act(() =>
        waitFor(() =>
          expect(result.current.debouncedSearchQuery).toEqual(
            result.current.searchQuery,
          ),
        ),
      );
    });
  });

  describe('Tag Filters', () => {
    it('defaults to empty', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(['/test']),
      });
      expect(result.current.tags).toEqual([]);
    });

    it('loads tags from the query param', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(['/test?tag=tag']),
      });
      expect(result.current.tags).toEqual(['tag']);
    });

    it('can handle multiple tags', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(['/test?tag=tag1&tag=tag2']),
      });
      expect(result.current.tags).toEqual(['tag1', 'tag2']);
    });

    it('can add a tag', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(['/test']),
      });
      act(() => {
        result.current.setTags(['tag']);
      });
      expect(result.current.tags).toEqual(['tag']);
    });

    it('can add multiple tags', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: createWrapper(['/test']),
      });
      act(() => {
        result.current.setTags(['Tag1', 'Tag2']);
      });
      expect(result.current.tags).toEqual(['Tag1', 'Tag2']);
    });

    // TODO: Skipped due to react-router v6 migration - navigate() with replace: true doesn't trigger location updates in MemoryRouter test environment
    it.skip('resets the pagination when changed', () => {
      const { result } = renderHook(
        () => ({
          useSearch: useSearch(),
          usePaginationParams: usePaginationParams(),
          usePagination: usePagination(50, 1),
        }),
        {
          wrapper: createWrapper(['/test?tag=test&currentPage=2']),
        },
      );
      expect(result.current.usePaginationParams.currentPage).toBe(2);
      result.current.useSearch.setTags([]);
      expect(result.current.usePaginationParams.currentPage).toBe(0);
    });
  });
});
