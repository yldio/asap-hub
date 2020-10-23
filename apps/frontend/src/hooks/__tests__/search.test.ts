import { renderHook } from '@testing-library/react-hooks';
import { MemoryRouter } from 'react-router-dom';

import { useSearch } from '../search';

describe('useSearch', () => {
  it('returns defaults', () => {
    const { result } = renderHook(() => useSearch(), {
      wrapper: MemoryRouter,
    });
    expect(result.current.filters).toEqual(new Set());
    expect(result.current.searchQuery).toEqual(undefined);
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
    expect(result.current.searchQuery).toEqual(undefined);
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

  it('adds filter', () => {
    const { result } = renderHook(() => useSearch(), {
      wrapper: MemoryRouter,
      initialProps: {
        initialEntries: ['/test'],
      },
    });
    result.current.setFilter('test123');
    expect(result.current.filters).toEqual(new Set(['test123']));
  });

  it('adds multiple filters', () => {
    const { result } = renderHook(() => useSearch(), {
      wrapper: MemoryRouter,
      initialProps: {
        initialEntries: ['/test'],
      },
    });
    result.current.setFilter('test123');
    result.current.setFilter('test456');
    expect(result.current.filters).toEqual(new Set(['test123', 'test456']));
  });

  it('removes filter', () => {
    const { result } = renderHook(() => useSearch(), {
      wrapper: MemoryRouter,
      initialProps: {
        initialEntries: ['/test?filter=test123'],
      },
    });
    result.current.setFilter('test123');
    expect(result.current.filters).toEqual(new Set());
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
    expect(result.current.searchQuery).toEqual(undefined);
  });
});
