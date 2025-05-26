import {
  CompletedStatusOption,
  DEFAULT_COMPLETED_STATUS,
  ManuscriptStatus,
} from '@asap-hub/model';
import { searchQueryParam } from '@asap-hub/routing';
import { useHistory, useLocation } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { usePaginationParams } from '../../hooks';

const generateLinkFactory =
  (
    href: string,
    currentPage: number,
    statuses: string[],
    searchQuery: string,
  ) =>
  // (completedStatus: string, requestedAPCCoverage: string) => {
  (completedStatus: string) => {
    const params = new URLSearchParams();
    params.set('completedStatus', completedStatus);
    params.set('currentPage', currentPage.toString());

    if (searchQuery) {
      params.set('searchQuery', searchQuery);
    }

    // if (requestedAPCCoverage) {
    //   params.set('requestedAPCCoverage', requestedAPCCoverage);
    // }

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
  const currentUrlParams = new URLSearchParams(useLocation().search);
  const history = useHistory();

  const { resetPagination } = usePaginationParams();

  const searchQuery = currentUrlParams.get(searchQueryParam) || '';

  const completedStatus =
    (currentUrlParams.get('completedStatus') as CompletedStatusOption) ??
    DEFAULT_COMPLETED_STATUS;
  // const requestedAPCCoverage =
  //   (currentUrlParams.get(
  //     'requestedAPCCoverage',
  //   ) as RequestedAPCCoverageOption) ?? DEFAULT_REQUESTED_APC_COVERAGE;

  const selectedStatuses = currentUrlParams.getAll(
    'status',
  ) as ManuscriptStatus[];

  const setStatus = (status: ManuscriptStatus) => {
    resetPagination();

    const params = new URLSearchParams(history.location.search);
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

    history.replace({ search: params.toString() });
  };

  const setSearchQuery = (newSearchQuery: string) => {
    resetPagination();

    const newUrlParams = new URLSearchParams(history.location.search);
    newSearchQuery
      ? newUrlParams.set(searchQueryParam, newSearchQuery)
      : newUrlParams.delete(searchQueryParam);

    history.replace({ search: newUrlParams.toString() });
  };

  const [debouncedSearchQuery] = useDebounce(searchQuery, 600);

  return {
    completedStatus,
    debouncedSearchQuery,
    // requestedAPCCoverage,
    searchQuery,
    selectedStatuses,
    setSearchQuery,
    setStatus,
    generateLinkFactory,
  };
};
