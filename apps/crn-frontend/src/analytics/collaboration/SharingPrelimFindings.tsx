import {
  LimitedTimeRangeOption,
  sharingPrelimFindingsInitialSortingDirection,
  SharingPrelimFindingsSortingDirection,
  SortSharingPrelimFindings,
} from '@asap-hub/model';
import {
  LoadingContentBodyTable,
  SharingPrelimFindingsTable,
} from '@asap-hub/react-components';
import { Dispatch, FC, SetStateAction, Suspense, useState } from 'react';
import { usePagination, usePaginationParams } from '../../hooks';
import { useAnalyticsSharingPrelimFindings } from './state';

interface SharingPreliminaryFindingsProps {
  sort: SortSharingPrelimFindings;
  setSort: Dispatch<SetStateAction<SortSharingPrelimFindings>>;
  tags: string[];
  timeRange: LimitedTimeRangeOption;
}

const SharingPreliminaryFindingsTableContent: FC<
  SharingPreliminaryFindingsProps
> = ({ sort, setSort, tags, timeRange }) => {
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

const SharingPreliminaryFindings: FC<SharingPreliminaryFindingsProps> = (
  props,
) => (
  <Suspense fallback={<LoadingContentBodyTable />}>
    <SharingPreliminaryFindingsTableContent {...props} />
  </Suspense>
);

export default SharingPreliminaryFindings;
