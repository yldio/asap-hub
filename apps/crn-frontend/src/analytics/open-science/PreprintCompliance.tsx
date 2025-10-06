import { FC, Suspense } from 'react';
import {
  PreprintComplianceTable,
  LoadingContentBodyTable,
} from '@asap-hub/react-components';
import { useAnalytics, usePagination, usePaginationParams } from '../../hooks';
import { useAnalyticsPreprintCompliance } from './state';

interface PreprintComplianceProps {
  tags: string[];
}

const PreprintComplianceContent: FC<PreprintComplianceProps> = ({ tags }) => {
  const { currentPage, pageSize } = usePaginationParams();
  const { timeRange } = useAnalytics();

  const { items, total } = useAnalyticsPreprintCompliance({
    tags,
    sort: 'team_asc',
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
      // setSort={setSort}
      // setSortingDirection={setSortingDirection}
      // sort={sort}
      // sortingDirection={sortingDirection}
    />
  );
};

const PreprintCompliance: FC<PreprintComplianceProps> = ({ tags }) => {
  const { timeRange } = useAnalytics();
  const { currentPage } = usePaginationParams();
  return (
    <Suspense fallback={<LoadingContentBodyTable />}>
      <PreprintComplianceContent
        key={`${tags.join(',')}-${timeRange}-${currentPage}`}
        tags={tags}
      />
    </Suspense>
  );
};

export default PreprintCompliance;
