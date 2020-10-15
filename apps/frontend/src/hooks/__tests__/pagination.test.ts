import { renderHook } from '@testing-library/react-hooks';
import { MemoryRouter, useLocation } from 'react-router-dom';

import { usePaginationParams, usePagination } from '../pagination';

describe('usePaginationParams', () => {
  it('Returns default page and page size', () => {
    const { result } = renderHook(() => usePaginationParams(), {
      wrapper: MemoryRouter,
    });
    expect(result.current.currentPage).toBe(0);
    expect(result.current.pageSize).toBe(10);
  });

  it('Returns current page', () => {
    const { result } = renderHook(() => usePaginationParams(), {
      wrapper: MemoryRouter,
      initialProps: {
        initialEntries: [{ search: '?currentPage=1' }],
      },
    });
    expect(result.current.currentPage).toBe(1);
  });

  it('Returns provided provided page size', () => {
    const { result } = renderHook(() => usePaginationParams(12), {
      wrapper: MemoryRouter,
    });
    expect(result.current.pageSize).toBe(12);
  });
});

describe('usePagination', () => {
  it('returns the correct number of pages', () => {
    const { result } = renderHook(() => usePagination(31, 10), {
      wrapper: MemoryRouter,
    });
    expect(result.current.numberOfPages).toBe(4);
  });
  it('redirects if page is out of bounds', async () => {
    const {
      result: {
        current: { useLocationResult },
      },
    } = renderHook(
      () => ({
        useLocationResult: useLocation(),
        usePaginationLoadedResult: usePagination(31, 10),
      }),
      {
        wrapper: MemoryRouter,
        initialProps: {
          initialEntries: [{ search: '?currentPage=10' }],
        },
      },
    );
    const searchParams = new URLSearchParams(useLocationResult.search);
    expect(searchParams.get('currentPage')).toBe('3');
  });

  it('generates hrefs', async () => {
    const {
      result: {
        current: { renderPageHref },
      },
    } = renderHook(() => usePagination(31, 10), {
      wrapper: MemoryRouter,
      initialProps: {
        initialEntries: [{ search: '?currentPage=3' }],
      },
    });

    expect(renderPageHref(0)).toMatchInlineSnapshot(`"?"`);
    expect(renderPageHref(1)).toMatchInlineSnapshot(`"?currentPage=1"`);
    expect(renderPageHref(9)).toMatchInlineSnapshot(`"?currentPage=9"`);
  });

  it('preserves other query parameters', async () => {
    const {
      result: {
        current: { renderPageHref },
      },
    } = renderHook(() => usePagination(31, 10), {
      wrapper: MemoryRouter,
      initialProps: {
        initialEntries: [{ search: '?currentPage=3&searchQuery=123' }],
      },
    });

    expect(renderPageHref(0)).toMatchInlineSnapshot(`"?searchQuery=123"`);
    expect(renderPageHref(1)).toMatchInlineSnapshot(
      `"?searchQuery=123&currentPage=1"`,
    );
  });

  it('does not return a link for the current page', async () => {
    const {
      result: {
        current: { renderPageHref },
      },
    } = renderHook(() => usePagination(31, 10), {
      wrapper: MemoryRouter,
      initialProps: {
        initialEntries: [{ search: '?currentPage=3' }],
      },
    });

    expect(renderPageHref(3)).toEqual('');
  });
});
