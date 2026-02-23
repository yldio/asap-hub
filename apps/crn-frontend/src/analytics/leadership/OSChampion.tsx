import {
  osChampionInitialSortingDirection,
  OSChampionSortingDirection,
  SortOSChampion,
} from '@asap-hub/model';
import {
  LoadingContentBodyTable,
  OSChampionTable,
} from '@asap-hub/react-components';
import { FC, Suspense, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAnalytics, usePagination, usePaginationParams } from '../../hooks';
import { useAnalyticsOSChampion } from './state';

const SORT_PARAM = 'sort';

const validSortValues: SortOSChampion[] = [
  'team_asc',
  'team_desc',
  'os_champion_awards_asc',
  'os_champion_awards_desc',
];

export const getOSChampionSortFromSearch = (search: string): SortOSChampion => {
  const params = new URLSearchParams(search);
  const sort = params.get(SORT_PARAM);
  if (sort && validSortValues.includes(sort as SortOSChampion)) {
    return sort as SortOSChampion;
  }
  return 'team_asc';
};

const getSortingDirectionFromSort = (
  sort: SortOSChampion,
): OSChampionSortingDirection => {
  const direction = sort.endsWith('_asc') ? 'asc' : 'desc';
  const field = sort.replace(
    /_(asc|desc)$/,
    '',
  ) as keyof OSChampionSortingDirection;
  const fieldMap: Record<string, keyof OSChampionSortingDirection> = {
    team: 'team',
    os_champion_awards: 'osChampionAwards',
  };
  const key = fieldMap[field] ?? 'team';
  return {
    ...osChampionInitialSortingDirection,
    [key]: direction,
  };
};

interface OSChampionProps {
  tags: string[];
}

const OSChampionContent: React.FC<
  OSChampionProps & {
    sort: SortOSChampion;
    setSort: React.Dispatch<React.SetStateAction<SortOSChampion>>;
    sortingDirection: OSChampionSortingDirection;
  }
> = ({ tags, sort, setSort, sortingDirection }) => {
  const { currentPage, pageSize } = usePaginationParams();
  const { timeRange } = useAnalytics();

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
      numberOfPages={numberOfPages}
      renderPageHref={renderPageHref}
      currentPageIndex={currentPage}
    />
  );
};

const OSChampion: FC<OSChampionProps> = ({ tags }) => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const sort = getOSChampionSortFromSearch(search);
  const sortingDirection = getSortingDirectionFromSort(sort);

  const setSort = useCallback(
    (value: React.SetStateAction<SortOSChampion>) => {
      const newSort = typeof value === 'function' ? value(sort) : value;
      const params = new URLSearchParams(search);
      params.set(SORT_PARAM, newSort);
      params.delete('currentPage');
      void navigate({ search: params.toString() } as never, { replace: true });
    },
    [navigate, search, sort],
  );

  return (
    <Suspense key={search} fallback={<LoadingContentBodyTable />}>
      <OSChampionContent
        tags={tags}
        sort={sort}
        setSort={setSort}
        sortingDirection={sortingDirection}
      />
    </Suspense>
  );
};

export default OSChampion;
