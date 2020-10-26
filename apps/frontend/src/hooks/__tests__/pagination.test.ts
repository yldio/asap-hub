import { renderHook } from '@testing-library/react-hooks';
import { MemoryRouter, useLocation } from 'react-router-dom';

import { usePaginationParams, usePagination } from '../pagination';

const urlSearchParamsToObject = (queryString: string) =>
  Object.fromEntries(new URLSearchParams(queryString));

describe('usePaginationParams', () => {
  it('returns default page and page size', () => {
    const { result } = renderHook(() => usePaginationParams(), {
      wrapper: MemoryRouter,
    });
    expect(result.current.currentPage).toBe(0);
    expect(result.current.pageSize).toBe(10);
  });

  it('returns current page', () => {
    const { result } = renderHook(() => usePaginationParams(), {
      wrapper: MemoryRouter,
      initialProps: {
        initialEntries: [{ search: '?currentPage=1' }],
      },
    });
    expect(result.current.currentPage).toBe(1);
  });

  it('returns provided page size', () => {
    const { result } = renderHook(() => usePaginationParams(12), {
      wrapper: MemoryRouter,
    });
    expect(result.current.pageSize).toBe(12);
  });

  it('removes pagination parameters from url', () => {
    const { result } = renderHook(
      () => ({
        usePaginationParamsResult: usePaginationParams(),
        useLocationResult: useLocation(),
      }),
      {
        wrapper: MemoryRouter,
        initialProps: { initialEntries: [{ search: '?currentPage=2' }] },
      },
    );
    expect(
      urlSearchParamsToObject(result.current.useLocationResult.search),
    ).toEqual({ currentPage: '2' });
    result.current.usePaginationParamsResult.resetPagination();
    expect(
      urlSearchParamsToObject(result.current.useLocationResult.search),
    ).toEqual({});
  });
});

describe('usePagination', () => {
  it('returns the correct number of pages', () => {
    const { result } = renderHook(() => usePagination(31, 10), {
      wrapper: MemoryRouter,
    });
    expect(result.current.numberOfPages).toBe(4);
  });

  it('handles no items', () => {
    const { result } = renderHook(() => usePagination(0, 10), {
      wrapper: MemoryRouter,
    });
    expect(result.current.numberOfPages).toBe(1);
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

    expect(renderPageHref(0)).toEqual('.');
    expect(urlSearchParamsToObject(renderPageHref(1))).toEqual({
      currentPage: '1',
    });
    expect(urlSearchParamsToObject(renderPageHref(9))).toEqual({
      currentPage: '9',
    });
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

    expect(urlSearchParamsToObject(renderPageHref(0))).toEqual({
      searchQuery: '123',
    });
    expect(urlSearchParamsToObject(renderPageHref(1))).toEqual({
      searchQuery: '123',
      currentPage: '1',
    });
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
