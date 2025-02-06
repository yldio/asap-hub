import { useState } from 'react';
import { SearchField, ComplianceDashboard } from '@asap-hub/react-components';
import {
  complianceInitialSortingDirection,
  ComplianceSortingDirection,
  ManuscriptPutRequest,
  SortCompliance,
} from '@asap-hub/model';

import { SearchFrame } from '@asap-hub/frontend-utils';
import {
  useIsComplianceReviewer,
  useManuscripts,
  usePutManuscript,
} from './state';

import { usePagination, usePaginationParams, useSearch } from '../../hooks';
import { useAssignedUsersSuggestions } from '../../shared-state/shared-research';
import { useManuscriptToast } from './useManuscriptToast';

const Compliance: React.FC = () => {
  const { currentPage, pageSize } = usePaginationParams();
  const { filters, searchQuery, setSearchQuery } = useSearch();
  const result = useManuscripts({
    searchQuery,
    currentPage,
    pageSize,
    filters,
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

  const { setFormType } = useManuscriptToast();

  return (
    <article>
      <SearchField
        placeholder="Enter team name, ID, assigned users..."
        value={searchQuery}
        onChange={setSearchQuery}
      />
      <SearchFrame title="">
        <ComplianceDashboard
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
