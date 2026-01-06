import { renderHook, waitFor, act } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';
import { PAGE_SIZE, usePagination, usePaginationParams } from '../pagination';

const urlSearchParamsToObject = (queryString: string) =>
  Object.fromEntries(new URLSearchParams(queryString));

describe('usePaginationParams', () => {
  it('returns default page, page size and view', () => {
    const { result } = renderHook(() => usePaginationParams(), {
      wrapper: MemoryRouter,
    });
    expect(result.current.currentPage).toBe(0);
    expect(result.current.pageSize).toBe(PAGE_SIZE);
  });

  it('returns current page', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={['/?currentPage=1']}>
        {children}
      </MemoryRouter>
    );
    const { result } = renderHook(() => usePaginationParams(), {
      wrapper,
    });
    expect(result.current.currentPage).toBe(1);
  });

  it('removes pagination parameters from url after reset', async () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={['/?currentPage=2']}>
        {children}
      </MemoryRouter>
    );
    const { result } = renderHook(
      () => ({
        usePaginationParamsResult: usePaginationParams(),
        useLocationResult: useLocation(),
      }),
      {
        wrapper,
      },
    );
    expect(
      urlSearchParamsToObject(result.current.useLocationResult.search),
    ).toEqual({ currentPage: '2' });

    act(() => {
      result.current.usePaginationParamsResult.resetPagination();
    });

    await waitFor(() => {
      expect(
        urlSearchParamsToObject(result.current.useLocationResult.search),
      ).toEqual({});
    });
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
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={['/?currentPage=10']}>
        {children}
      </MemoryRouter>
    );
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
        wrapper,
      },
    );
    const searchParams = new URLSearchParams(useLocationResult.search);
    expect(searchParams.get('currentPage')).toBe('3');
  });

  it('generates hrefs', async () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={['/?currentPage=3']}>
        {children}
      </MemoryRouter>
    );
    const {
      result: {
        current: { renderPageHref },
      },
    } = renderHook(() => usePagination(31, 10), {
      wrapper,
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
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={['/test?currentPage=3']}>
        {children}
      </MemoryRouter>
    );
    const {
      result: {
        current: { renderPageHref },
      },
    } = renderHook(() => usePagination(31, 10), {
      wrapper,
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
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={['/?currentPage=3&searchQuery=123']}>
        {children}
      </MemoryRouter>
    );
    const {
      result: {
        current: { renderPageHref },
      },
    } = renderHook(() => usePagination(31, 10), {
      wrapper,
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
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={['/?currentPage=3']}>
        {children}
      </MemoryRouter>
    );
    const {
      result: {
        current: { renderPageHref },
      },
    } = renderHook(() => usePagination(31, 10), {
      wrapper,
    });

    expect(renderPageHref(3)).toEqual('');
  });
});
