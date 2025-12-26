import {
  CompletedStatusOption,
  DEFAULT_COMPLETED_STATUS,
  ManuscriptStatus,
  DEFAULT_REQUESTED_APC_COVERAGE,
  RequestedAPCCoverageOption,
} from '@asap-hub/model';
import { searchQueryParam } from '@asap-hub/routing';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { usePaginationParams } from '../../hooks';

const generateLinkFactory =
  (
    href: string,
    currentPage: number,
    statuses: string[],
    searchQuery: string,
  ) =>
  (completedStatus: string, requestedAPCCoverage: string) => {
    const params = new URLSearchParams();
    params.set('completedStatus', completedStatus);
    params.set('currentPage', currentPage.toString());

    if (searchQuery) {
      params.set('searchQuery', searchQuery);
    }

    if (requestedAPCCoverage) {
      params.set('requestedAPCCoverage', requestedAPCCoverage);
    }

    const filteredStatuses =
      completedStatus === 'hide'
        ? statuses.filter(
            (status) => !['Compliant', 'Closed (other)'].includes(status),
          )
        : statuses;

    filteredStatuses.forEach((status) => params.append('status', status));

    return `${href}?${params.toString()}`;
  };

export const useComplianceSearch = () => {
  const location = useLocation();
  const currentUrlParams = new URLSearchParams(location.search);
  const navigate = useNavigate();

  const { resetPagination } = usePaginationParams();

  const searchQuery = currentUrlParams.get(searchQueryParam) || '';

  const completedStatus =
    (currentUrlParams.get('completedStatus') as CompletedStatusOption) ??
    DEFAULT_COMPLETED_STATUS;
  const requestedAPCCoverage =
    (currentUrlParams.get(
      'requestedAPCCoverage',
    ) as RequestedAPCCoverageOption) ?? DEFAULT_REQUESTED_APC_COVERAGE;

  const selectedStatuses = currentUrlParams.getAll(
    'status',
  ) as ManuscriptStatus[];

  const setStatus = (status: ManuscriptStatus) => {
    const params = new URLSearchParams(location.search);
    resetPagination(params);
    const currentStatuses = params.getAll('status');

    if (currentStatuses.includes(status)) {
      params.delete('status');

      const newStatuses = currentStatuses.filter(
        (s) => s !== status,
      ) as ManuscriptStatus[];
      newStatuses.forEach((s) => params.append('status', s));
    } else {
      params.append('status', status);
    }

    navigate({ search: params.toString() } as never, { replace: true });
  };

  const setSearchQuery = (newSearchQuery: string) => {
    const newUrlParams = new URLSearchParams(location.search);
    resetPagination(newUrlParams);
    newSearchQuery
      ? newUrlParams.set(searchQueryParam, newSearchQuery)
      : newUrlParams.delete(searchQueryParam);

    navigate({ search: newUrlParams.toString() } as never, { replace: true });
  };

  const [debouncedSearchQuery] = useDebounce(searchQuery, 600);

  return {
    completedStatus,
    debouncedSearchQuery,
    requestedAPCCoverage,
    searchQuery,
    selectedStatuses,
    setSearchQuery,
    setStatus,
    generateLinkFactory,
  };
};
