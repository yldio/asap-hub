import { FC, Suspense, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import {
  PreprintComplianceTable,
  LoadingContentBodyTable,
} from '@asap-hub/react-components';
import {
  SortPreprintCompliance,
  PreprintComplianceSortingDirection,
  preprintComplianceInitialSortingDirection,
} from '@asap-hub/model';
import { useAnalytics, usePagination, usePaginationParams } from '../../hooks';
import { useAnalyticsPreprintCompliance } from './state';

const SORT_PARAM = 'sort';

const validSortValues: SortPreprintCompliance[] = [
  'team_asc',
  'team_desc',
  'number_of_preprints_asc',
  'number_of_preprints_desc',
  'posted_prior_asc',
  'posted_prior_desc',
];

export const getPreprintComplianceSortFromSearch = (search: string): SortPreprintCompliance => {
  const params = new URLSearchParams(search);
  const sort = params.get(SORT_PARAM);
  if (sort && validSortValues.includes(sort as SortPreprintCompliance)) {
    return sort as SortPreprintCompliance;
  }
  return 'team_asc';
};

const getSortingDirectionFromSort = (
  sort: SortPreprintCompliance,
): PreprintComplianceSortingDirection => {
  const direction = sort.endsWith('_asc') ? 'asc' : 'desc';
  const field = sort.replace(
    /_(asc|desc)$/,
    '',
  ) as keyof PreprintComplianceSortingDirection;
  const fieldMap: Record<string, keyof PreprintComplianceSortingDirection> = {
    team: 'team',
    number_of_preprints: 'numberOfPreprints',
    posted_prior: 'postedPriorPercentage',
  };
  const key = fieldMap[field] ?? 'team';
  return {
    ...preprintComplianceInitialSortingDirection,
    [key]: direction,
  };
};

interface PreprintComplianceProps {
  tags: string[];
}

const PreprintComplianceContent: FC<
  PreprintComplianceProps & {
    sort: SortPreprintCompliance;
    setSort: React.Dispatch<React.SetStateAction<SortPreprintCompliance>>;
    sortingDirection: PreprintComplianceSortingDirection;
  }
> = ({ tags, sort, setSort, sortingDirection }) => {
  const { currentPage, pageSize } = usePaginationParams();
  const { timeRange } = useAnalytics();

  const { items, total } = useAnalyticsPreprintCompliance({
    tags,
    sort,
    currentPage,
    pageSize,
    timeRange,
  });

  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);

  return (
    <PreprintComplianceTable
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

const PreprintCompliance: FC<PreprintComplianceProps> = ({ tags }) => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const sort = getPreprintComplianceSortFromSearch(search);
  const sortingDirection = getSortingDirectionFromSort(sort);
  const setSort = useCallback(
    (value: React.SetStateAction<SortPreprintCompliance>) => {
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
      <PreprintComplianceContent
        tags={tags}
        sort={sort}
        setSort={setSort}
        sortingDirection={sortingDirection}
      />
    </Suspense>
  );
};

export default PreprintCompliance;
