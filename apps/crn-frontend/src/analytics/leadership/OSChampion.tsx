import {
  osChampionInitialSortingDirection,
  OSChampionSortingDirection,
  SortOSChampion,
} from '@asap-hub/model';
import {
  LoadingContentBodyTable,
  OSChampionTable,
} from '@asap-hub/react-components';
import { Dispatch, SetStateAction, Suspense, useState } from 'react';
import { useAnalytics, usePagination, usePaginationParams } from '../../hooks';
import { useAnalyticsOSChampion } from './state';

interface OSChampionProps {
  sort: SortOSChampion;
  setSort: Dispatch<SetStateAction<SortOSChampion>>;
  tags: string[];
}

const OSChampionContent: React.FC<OSChampionProps> = ({
  sort,
  setSort,
  tags,
}) => {
  const { currentPage, pageSize } = usePaginationParams();
  const { timeRange } = useAnalytics();

  const [sortingDirection, setSortingDirection] =
    useState<OSChampionSortingDirection>(osChampionInitialSortingDirection);

  const { items, total } = useAnalyticsOSChampion({
    tags,
    sort,
    currentPage,
    pageSize,
    timeRange,
  });

  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);

  return (
    <OSChampionTable
      data={items}
      sort={sort}
      setSort={setSort}
      sortingDirection={sortingDirection}
      setSortingDirection={setSortingDirection}
      numberOfPages={numberOfPages}
      renderPageHref={renderPageHref}
      currentPageIndex={currentPage}
    />
  );
};

const OSChampion: React.FC<OSChampionProps> = ({ sort, setSort, tags }) => {
  return (
    <Suspense fallback={<LoadingContentBodyTable />}>
      <OSChampionContent sort={sort} setSort={setSort} tags={tags} />
    </Suspense>
  );
};

export default OSChampion;
