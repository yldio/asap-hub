import { SearchFrame } from '@asap-hub/frontend-utils';
import {
  CompletedStatusOption,
  complianceInitialSortingDirection,
  ComplianceSortingDirection,
  DEFAULT_COMPLETED_STATUS,
  DEFAULT_REQUESTED_APC_COVERAGE,
  ManuscriptPutRequest,
  RequestedAPCCoverageOption,
  SortCompliance,
} from '@asap-hub/model';
import { ComplianceDashboard, SearchField } from '@asap-hub/react-components';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { usePagination, usePaginationParams, useSearch } from '../../hooks';
import { useAssignedUsersSuggestions } from '../../shared-state/shared-research';
import {
  useIsComplianceReviewer,
  useManuscripts,
  usePutManuscript,
} from './state';
import { useManuscriptToast } from './useManuscriptToast';

const Compliance: React.FC = () => {
  const { searchQuery, debouncedSearchQuery, setSearchQuery } = useSearch();
  const { currentPage, pageSize } = usePaginationParams();
  const currentUrlParams = new URLSearchParams(useLocation().search);
  const completedStatus =
    (currentUrlParams.get('completedStatus') as CompletedStatusOption) ??
    DEFAULT_COMPLETED_STATUS;
  const requestedAPCCoverage =
    (currentUrlParams.get(
      'requestedAPCCoverage',
    ) as RequestedAPCCoverageOption) ?? DEFAULT_REQUESTED_APC_COVERAGE;

  const { setFormType } = useManuscriptToast();
  const result = useManuscripts({
    searchQuery: debouncedSearchQuery,
    currentPage,
    pageSize,
    requestedAPCCoverage,
    completedStatus,
  });

  const { numberOfPages, renderPageHref } = usePagination(
    result.total,
    pageSize,
  );

  const isComplianceReviewer = useIsComplianceReviewer();
  const getAssignedUsersSuggestions = useAssignedUsersSuggestions();
  const [sort, setSort] = useState<SortCompliance>('team_asc');
  const [sortingDirection, setSortingDirection] =
    useState<ComplianceSortingDirection>(complianceInitialSortingDirection);

  const updateManuscript = usePutManuscript();

  const handleUpdateManuscript = async (
    id: string,
    manuscript: ManuscriptPutRequest,
  ) => {
    const manuscriptResponse = await updateManuscript(id, manuscript);
    result.refresh(manuscriptResponse);
    setFormType({ type: 'assigned-users', accent: 'successLarge' });
    return manuscriptResponse;
  };

  return (
    <article>
      <SearchField
        placeholder="Enter team name, ID, assigned users..."
        value={searchQuery}
        onChange={setSearchQuery}
      />
      <SearchFrame title="">
        <ComplianceDashboard
          completedStatus={completedStatus as CompletedStatusOption}
          requestedAPCCoverage={
            requestedAPCCoverage as RequestedAPCCoverageOption
          }
          isComplianceReviewer={isComplianceReviewer}
          data={result.items}
          setSort={setSort}
          setSortingDirection={setSortingDirection}
          sort={sort}
          sortingDirection={sortingDirection}
          currentPageIndex={currentPage}
          numberOfPages={numberOfPages}
          renderPageHref={renderPageHref}
          onUpdateManuscript={handleUpdateManuscript}
          getAssignedUsersSuggestions={(input) =>
            getAssignedUsersSuggestions(input).then((authors) =>
              authors.map((author) => ({
                author,
                label: author.displayName,
                value: author.id,
              })),
            )
          }
        />
      </SearchFrame>
    </article>
  );
};

export default Compliance;
