import { useState } from 'react';
import { SearchField, ComplianceDashboard } from '@asap-hub/react-components';
import {
  complianceInitialSortingDirection,
  ComplianceSortingDirection,
  SortCompliance,
} from '@asap-hub/model';

import { SearchFrame } from '@asap-hub/frontend-utils';
import { useManuscripts } from './state';

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
        />
      </SearchFrame>
    </article>
  );
};

export default Compliance;
