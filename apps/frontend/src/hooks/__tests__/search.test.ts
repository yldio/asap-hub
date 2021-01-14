import { renderHook } from '@testing-library/react-hooks';
import { MemoryRouter } from 'react-router-dom';

import { useSearch } from '../search';
import { usePagination, usePaginationParams } from '../pagination';

describe('useSearch', () => {
  it('returns defaults', () => {
    const { result } = renderHook(() => useSearch(), {
      wrapper: MemoryRouter,
    });
    expect(result.current.filters).toEqual(new Set());
    expect(result.current.searchQuery).toEqual('');
  });

  it('returns search query', () => {
    const { result } = renderHook(() => useSearch(), {
      wrapper: MemoryRouter,
      initialProps: {
        initialEntries: ['/test?searchQuery=test123'],
      },
    });
    expect(result.current.filters).toEqual(new Set());
    expect(result.current.searchQuery).toEqual('test123');
  });

  it('returns single filter', () => {
    const { result } = renderHook(() => useSearch(), {
      wrapper: MemoryRouter,
      initialProps: {
        initialEntries: ['/test?filter=test123'],
      },
    });
    expect(result.current.filters).toEqual(new Set(['test123']));
    expect(result.current.searchQuery).toEqual('');
  });

  it('returns multiple filters', () => {
    const { result } = renderHook(() => useSearch(), {
      wrapper: MemoryRouter,
      initialProps: {
        initialEntries: ['/test?filter=test123&filter=test456'],
      },
    });
    expect(result.current.filters).toEqual(new Set(['test123', 'test456']));
  });

  it('returns the search query params', () => {
    const { result } = renderHook(useSearch, {
      wrapper: MemoryRouter,
      initialProps: {
        initialEntries: ['/test?searchQuery=test123'],
      },
    });
    expect(result.current.searchQueryParams.get('searchQuery')).toBe('test123');
  });
  it('returns empty search query params if no search query set', () => {
    const { result } = renderHook(useSearch, {
      wrapper: MemoryRouter,
      initialProps: {
        initialEntries: ['/test'],
      },
    });
    expect(result.current.searchQueryParams.has('searchQuery')).toBe(false);
  });
  it('does not include filter in the search query params', () => {
    const { result } = renderHook(useSearch, {
      wrapper: MemoryRouter,
      initialProps: {
        initialEntries: ['/test?searchQuery=test123&filter=test123'],
      },
    });
    expect(result.current.searchQueryParams.has('filter')).toBe(false);
  });

  it('adds filter', () => {
    const { result } = renderHook(() => useSearch(), {
      wrapper: MemoryRouter,
      initialProps: {
        initialEntries: ['/test'],
      },
    });
    result.current.toggleFilter('test123');
    expect(result.current.filters).toEqual(new Set(['test123']));
  });

  it('adds multiple filters', () => {
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

  it('removes filter', () => {
    const { result } = renderHook(() => useSearch(), {
      wrapper: MemoryRouter,
      initialProps: {
        initialEntries: ['/test?filter=test123'],
      },
    });
    result.current.toggleFilter('test123');
    expect(result.current.filters).toEqual(new Set());
  });

  it('resets pagination when filter toggled', () => {
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

  it('sets search query', () => {
    const { result } = renderHook(() => useSearch(), {
      wrapper: MemoryRouter,
      initialProps: {
        initialEntries: ['/test'],
      },
    });
    result.current.setSearchQuery('test123');
    expect(result.current.searchQuery).toEqual('test123');
  });

  it('removes search query', () => {
    const { result } = renderHook(() => useSearch(), {
      wrapper: MemoryRouter,
      initialProps: {
        initialEntries: ['/test?searchQuery=test123'],
      },
    });
    result.current.setSearchQuery('');
    expect(result.current.searchQuery).toEqual('');
  });

  it('resets pagination when search set', () => {
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
