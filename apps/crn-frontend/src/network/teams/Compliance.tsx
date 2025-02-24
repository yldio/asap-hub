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
import { useEffect, useRef, useState } from 'react';
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
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    completedStatus,
    debouncedSearchQuery,
    requestedAPCCoverage,
    searchQuery,
    selectedStatuses,
    setSearchQuery,
    setStatus,
    generateLink,
  } = useComplianceSearch();
  const hasAppliedFilters =
    selectedStatuses.length > 0 ||
    searchQuery.trim() !== '' ||
    completedStatus !== DEFAULT_COMPLETED_STATUS ||
    requestedAPCCoverage !== DEFAULT_REQUESTED_APC_COVERAGE;

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

  useEffect(() => {
    inputRef.current?.focus();
  }, [result.items]);

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
        ref={inputRef}
      />
      <SearchFrame title="">
        <ComplianceDashboard
          hasAppliedFilters={hasAppliedFilters}
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
          generateLink={generateLink}
          manuscriptCount={result.total}
        />
      </SearchFrame>
    </article>
  );
};

export default Compliance;
