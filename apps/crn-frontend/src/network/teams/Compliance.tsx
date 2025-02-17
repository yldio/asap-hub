import { SearchFrame } from '@asap-hub/frontend-utils';
import {
  CompletedStatusOption,
  complianceInitialSortingDirection,
  ComplianceSortingDirection,
  ManuscriptPutRequest,
  RequestedAPCCoverageOption,
  SortCompliance,
} from '@asap-hub/model';
import { ComplianceDashboard, SearchField } from '@asap-hub/react-components';
import { useState } from 'react';
import { usePagination, usePaginationParams } from '../../hooks';
import { useAssignedUsersSuggestions } from '../../shared-state/shared-research';
import {
  useIsComplianceReviewer,
  useManuscripts,
  usePutManuscript,
} from './state';
import { useComplianceSearch } from './useComplianceSearch';
import { useManuscriptToast } from './useManuscriptToast';

const Compliance: React.FC = () => {
  const {
    completedStatus,
    debouncedSearchQuery,
    requestedAPCCoverage,
    searchQuery,
    selectedStatuses,
    setSearchQuery,
    setStatus,
  } = useComplianceSearch();
  const { currentPage, pageSize } = usePaginationParams();

  const { setFormType } = useManuscriptToast();
  const result = useManuscripts({
    searchQuery: debouncedSearchQuery,
    currentPage,
    pageSize,
    requestedAPCCoverage,
    completedStatus,
    selectedStatuses,
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
          selectedStatuses={selectedStatuses}
          onSelectStatus={setStatus}
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
