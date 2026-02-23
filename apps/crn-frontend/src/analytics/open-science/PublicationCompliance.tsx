import { FC, Suspense, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import {
  PublicationComplianceTable,
  LoadingContentBodyTable,
} from '@asap-hub/react-components';
import {
  SortPublicationCompliance,
  PublicationComplianceSortingDirection,
  publicationComplianceInitialSortingDirection,
} from '@asap-hub/model';
import { useAnalytics, usePagination, usePaginationParams } from '../../hooks';
import { useAnalyticsPublicationCompliance } from './state';

const SORT_PARAM = 'sort';

const validSortValues: SortPublicationCompliance[] = [
  'team_asc',
  'team_desc',
  'publications_asc',
  'publications_desc',
  'datasets_asc',
  'datasets_desc',
  'protocols_asc',
  'protocols_desc',
  'code_asc',
  'code_desc',
  'lab_materials_asc',
  'lab_materials_desc',
];

const getSortFromSearch = (search: string): SortPublicationCompliance => {
  const params = new URLSearchParams(search);
  const sort = params.get(SORT_PARAM);
  if (sort && validSortValues.includes(sort as SortPublicationCompliance)) {
    return sort as SortPublicationCompliance;
  }
  return 'team_asc';
};

const getSortingDirectionFromSort = (
  sort: SortPublicationCompliance,
): PublicationComplianceSortingDirection => {
  const direction = sort.endsWith('_asc') ? 'asc' : 'desc';
  const field = sort.replace(
    /_(asc|desc)$/,
    '',
  ) as keyof PublicationComplianceSortingDirection;
  const fieldMap: Record<string, keyof PublicationComplianceSortingDirection> =
    {
      team: 'team',
      publications: 'publications',
      datasets: 'datasets',
      protocols: 'protocols',
      code: 'code',
      lab_materials: 'labMaterials',
    };
  const key = fieldMap[field] ?? 'team';
  return {
    ...publicationComplianceInitialSortingDirection,
    [key]: direction,
  };
};

interface PublicationComplianceProps {
  tags: string[];
}

const PublicationComplianceContent: FC<
  PublicationComplianceProps & {
    sort: SortPublicationCompliance;
    setSort: React.Dispatch<React.SetStateAction<SortPublicationCompliance>>;
    sortingDirection: PublicationComplianceSortingDirection;
    setSortingDirection: React.Dispatch<
      React.SetStateAction<PublicationComplianceSortingDirection>
    >;
  }
> = ({ tags, sort, setSort, sortingDirection, setSortingDirection }) => {
  const { currentPage, pageSize } = usePaginationParams();
  const { timeRange } = useAnalytics();

  const { items, total } = useAnalyticsPublicationCompliance({
    tags,
    sort,
    currentPage,
    pageSize,
    timeRange,
  });

  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);

  return (
    <PublicationComplianceTable
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

const PublicationCompliance: FC<PublicationComplianceProps> = ({ tags }) => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const sort = getSortFromSearch(search);
  const sortingDirection = getSortingDirectionFromSort(sort);

  const setSort = useCallback(
    (value: React.SetStateAction<SortPublicationCompliance>) => {
      const newSort = typeof value === 'function' ? value(sort) : value;
      const params = new URLSearchParams(search);
      params.set(SORT_PARAM, newSort);
      params.delete('currentPage');
      void navigate({ search: params.toString() } as never, { replace: true });
    },
    [navigate, search, sort],
  );

  const setSortingDirection = useCallback(
    (_value: React.SetStateAction<PublicationComplianceSortingDirection>) => {
      // Direction is derived from sort URL param; no-op here
    },
    [],
  );

  return (
    <Suspense key={search} fallback={<LoadingContentBodyTable />}>
      <PublicationComplianceContent
        tags={tags}
        sort={sort}
        setSort={setSort}
        sortingDirection={sortingDirection}
        setSortingDirection={setSortingDirection}
      />
    </Suspense>
  );
};

export default PublicationCompliance;
