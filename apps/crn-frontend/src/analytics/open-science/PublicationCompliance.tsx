import { FC, Suspense } from 'react';
import {
  PublicationComplianceTable,
  LoadingContentBodyTable,
} from '@asap-hub/react-components';
import { LimitedTimeRangeOption } from '@asap-hub/model';
import { useAnalytics, usePagination, usePaginationParams } from '../../hooks';
import { useAnalyticsPublicationCompliance } from './state';

interface PublicationComplianceProps {
  tags: string[];
  timeRange: LimitedTimeRangeOption;
  currentPage: number;
}

const PublicationComplianceContent: FC<PublicationComplianceProps> = ({
  tags,
}) => {
  const { currentPage, pageSize } = usePaginationParams();
  // TODO: add these back post MVP
  // const [sort, setSort] = useState<SortPublicationCompliance>('team_asc');
  // const [sortingDirection, setSortingDirection] =
  //   useState<PublicationComplianceSortingDirection>('asc');
  const { timeRange } = useAnalytics();

  const { items, total } = useAnalyticsPublicationCompliance({
    tags,
    sort: 'team_asc',
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
      // setSort={setSort}
      // setSortingDirection={setSortingDirection}
      // sort={sort}
      // sortingDirection={sortingDirection}
    />
  );
};

const PublicationCompliance: FC<PublicationComplianceProps> = ({ tags }) => {
  const { timeRange } = useAnalytics();
  const { currentPage } = usePaginationParams();
  return (
    <Suspense fallback={<LoadingContentBodyTable />}>
      <PublicationComplianceContent
        key={`${tags.join(',')}-${timeRange}-${currentPage}`}
        tags={tags}
      />
    </Suspense>
  );
};

export default PublicationCompliance;
