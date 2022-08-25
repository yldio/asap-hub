import { renderHook } from '@testing-library/react-hooks/server';
import { MemoryRouter, useLocation } from 'react-router-dom';

import {
  usePaginationParams,
  usePagination,
  LIST_VIEW_PAGE_SIZE,
  CARD_VIEW_PAGE_SIZE,
} from '../pagination';

const urlSearchParamsToObject = (queryString: string) =>
  Object.fromEntries(new URLSearchParams(queryString));

describe('usePaginationParams', () => {
  it('returns default page, page size and view', () => {
    const { result } = renderHook(() => usePaginationParams(), {
      wrapper: MemoryRouter,
    });
    expect(result.current.currentPage).toBe(0);
    expect(result.current.pageSize).toBe(CARD_VIEW_PAGE_SIZE);
    expect(result.current.isListView).toBe(false);
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

  it('returns list view page size', () => {
    const { result } = renderHook(() => usePaginationParams(), {
      wrapper: MemoryRouter,
      initialProps: {
        initialEntries: [{ search: `?view=list` }],
      },
    });
    expect(result.current.pageSize).toBe(LIST_VIEW_PAGE_SIZE);
    expect(result.current.isListView).toBe(true);
  });

  it('removes pagination parameters from url after reset', () => {
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

  it('generates card and list view params', () => {
    const { result } = renderHook(
      () => ({
        usePaginationParamsResult: usePaginationParams(),
        useLocationResult: useLocation(),
      }),
      {
        wrapper: MemoryRouter,
        initialProps: {
          initialEntries: [
            { search: '?currentPage=2&view=list&searchQuery=123' },
          ],
        },
      },
    );
    expect(
      urlSearchParamsToObject(
        result.current.usePaginationParamsResult.cardViewParams,
      ),
    ).toEqual({ searchQuery: '123' });
    expect(
      urlSearchParamsToObject(
        result.current.usePaginationParamsResult.listViewParams,
      ),
    ).toEqual({ searchQuery: '123', view: 'list' });
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

    expect(renderPageHref(0)).toEqual('/');
    expect(urlSearchParamsToObject(renderPageHref(1))).toEqual({
      currentPage: '1',
    });
    expect(urlSearchParamsToObject(renderPageHref(9))).toEqual({
      currentPage: '9',
    });
  });

  it('generates hrefs one level deep', async () => {
    const {
      result: {
        current: { renderPageHref },
      },
    } = renderHook(() => usePagination(31, 10), {
      wrapper: MemoryRouter,
      initialProps: {
        initialEntries: [
          {
            pathname: '/test',
            search: '?currentPage=3',
          },
        ],
      },
    });

    expect(renderPageHref(0)).toEqual('/test');
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
