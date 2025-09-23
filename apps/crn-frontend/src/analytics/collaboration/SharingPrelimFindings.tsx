import {
  sharingPrelimFindingsInitialSortingDirection,
  SharingPrelimFindingsSortingDirection,
  SortSharingPrelimFindings,
  TimeRangeOptionPreliminaryDataSharing,
} from '@asap-hub/model';
import { SharingPrelimFindingsTable } from '@asap-hub/react-components';
import { Dispatch, SetStateAction, useState } from 'react';
import { usePagination, usePaginationParams } from '../../hooks';
import { useAnalyticsSharingPrelimFindings } from './state';

interface SharingPreliminaryFindingsProps {
  sort: SortSharingPrelimFindings;
  setSort: Dispatch<SetStateAction<SortSharingPrelimFindings>>;
  tags: string[];
  timeRange: TimeRangeOptionPreliminaryDataSharing;
}

const SharingPreliminaryFindings: React.FC<SharingPreliminaryFindingsProps> = ({
  sort,
  setSort,
  tags,
  timeRange,
}) => {
  const { currentPage, pageSize } = usePaginationParams();
  const [sortingDirection, setSortingDirection] =
    useState<SharingPrelimFindingsSortingDirection>(
      sharingPrelimFindingsInitialSortingDirection,
    );

  const { items, total } = useAnalyticsSharingPrelimFindings({
    currentPage,
    pageSize,
    sort,
    tags,
    timeRange: timeRange || 'all',
  });

  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);

  return (
    <SharingPrelimFindingsTable
      currentPageIndex={currentPage}
      data={items}
      numberOfPages={numberOfPages}
      renderPageHref={renderPageHref}
      setSort={setSort}
      setSortingDirection={setSortingDirection}
      sort={sort}
      sortingDirection={sortingDirection}
    />
  );
};

export default SharingPreliminaryFindings;
