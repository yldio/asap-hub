import { useState } from 'react';
import { SearchField, ComplianceDashboard } from '@asap-hub/react-components';
import {
  complianceInitialSortingDirection,
  ComplianceSortingDirection,
  ManuscriptPutRequest,
  SortCompliance,
} from '@asap-hub/model';

import { SearchFrame } from '@asap-hub/frontend-utils';
import { useManuscripts, usePutManuscript } from './state';

import { usePagination, usePaginationParams, useSearch } from '../../hooks';

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
          data={result.items}
          setSort={setSort}
          setSortingDirection={setSortingDirection}
          sort={sort}
          sortingDirection={sortingDirection}
          currentPageIndex={currentPage}
          numberOfPages={numberOfPages}
          renderPageHref={renderPageHref}
          onUpdateManuscript={handleUpdateManuscript}
        />
      </SearchFrame>
    </article>
  );
};

export default Compliance;
