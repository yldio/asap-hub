import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { viewParam, listViewValue } from '@asap-hub/routing';

const CURRENT_PAGE_PARAM = 'currentPage';

export const CARD_VIEW_PAGE_SIZE = 10;
export const LIST_VIEW_PAGE_SIZE = 20;

export const usePaginationParams = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentPage = Number(searchParams.get(CURRENT_PAGE_PARAM)) ?? 0;
  const isListView = searchParams.get(viewParam) === listViewValue;

  /**
   * Resets pagination by removing currentPage.
   * - If urlParams provided: modifies in-place (for chaining with other param changes)
   * - If not provided: navigates immediately to reset pagination
   */
  const resetPagination = (urlParams?: URLSearchParams): void => {
    if (urlParams) {
      urlParams.delete(CURRENT_PAGE_PARAM);
      return;
    }
    const params = new URLSearchParams(location.search);
    params.delete(CURRENT_PAGE_PARAM);
    navigate({ search: params.toString() } as never, { replace: true });
  };

  // Build view params only when accessed (lazy computation)
  const buildViewParams = (forListView: boolean): string => {
    const params = new URLSearchParams(searchParams);
    params.delete(CURRENT_PAGE_PARAM);
    if (forListView) {
      params.set(viewParam, listViewValue);
    } else {
      params.delete(viewParam);
    }
    const str = params.toString();
    return str ? `?${str}` : '';
  };

  return {
    currentPage,
    pageSize: isListView ? LIST_VIEW_PAGE_SIZE : CARD_VIEW_PAGE_SIZE,
    isListView,
    get listViewParams() {
      return buildViewParams(true);
    },
    get cardViewParams() {
      return buildViewParams(false);
    },
    resetPagination,
  };
};

export const usePagination = (numberOfItems: number, pageSize: number) => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Extract current page from URL params, defaulting to first page
  const currentPage = Number(searchParams.get('currentPage')) ?? 0;
  const lastAllowedPage = Math.max(0, Math.ceil(numberOfItems / pageSize) - 1);
  const numberOfPages = Math.max(currentPage, lastAllowedPage) + 1;

  // CRN-specific: Generate href for pagination links supporting both card and list views
  const renderPageHref = (page: number) => {
    const newSearchParams = new URLSearchParams(location.search);

    // Return empty string if already on current page (no navigation needed)
    if (page === currentPage) return '';
    // Remove param for page 0 (default), otherwise set explicit page number
    if (page === 0) newSearchParams.delete('currentPage');
    else newSearchParams.set('currentPage', String(page));

    const newParams = newSearchParams.toString();
    return `${newParams.length ? '?' : location.pathname}${newParams}`;
  };

  // Auto-correct: redirect to last valid page if user navigates beyond available pages
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (numberOfItems && currentPage > lastAllowedPage)
      navigate(
        {
          search: renderPageHref(lastAllowedPage),
        } as never,
        { replace: true },
      );
  });

  return {
    numberOfPages,
    renderPageHref,
  };
};
