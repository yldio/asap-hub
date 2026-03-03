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
import { Dispatch, FC, SetStateAction, Suspense } from 'react';
import { useLocation } from 'react-router';
import { usePagination, usePaginationParams } from '../../hooks';
import { useAnalyticsSharingPrelimFindings } from './state';

export const getSharingPrelimFindingsSortingDirectionFromSort = (
  sort: SortSharingPrelimFindings,
): SharingPrelimFindingsSortingDirection => {
  const direction = sort.endsWith('_asc') ? 'asc' : 'desc';
  const field = sort.replace(/_(asc|desc)$/, '');
  const fieldMap: Record<string, keyof SharingPrelimFindingsSortingDirection> =
    {
      team: 'team',
      percent_shared: 'percentShared',
    };
  const key = fieldMap[field] ?? 'team';

  return {
    ...sharingPrelimFindingsInitialSortingDirection,
    [key]: direction,
  };
};

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
  const sortingDirection =
    getSharingPrelimFindingsSortingDirectionFromSort(sort);

  const { items, total } = useAnalyticsSharingPrelimFindings({
    currentPage,
    pageSize,
    sort,
    tags,
    timeRange: timeRange || 'last-year',
  });

  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);

  return (
    <SharingPrelimFindingsTable
      currentPageIndex={currentPage}
      data={items}
      numberOfPages={numberOfPages}
      renderPageHref={renderPageHref}
      setSort={setSort}
      sort={sort}
      sortingDirection={sortingDirection}
    />
  );
};

const SharingPreliminaryFindings: FC<SharingPreliminaryFindingsProps> = (
  props,
) => {
  const { search } = useLocation();
  return (
    <Suspense key={search} fallback={<LoadingContentBodyTable />}>
      <SharingPreliminaryFindingsTableContent {...props} />
    </Suspense>
  );
};

export default SharingPreliminaryFindings;
