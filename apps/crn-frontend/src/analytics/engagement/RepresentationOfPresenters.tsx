import {
  engagementInitialSortingDirection,
  EngagementSortingDirection,
  SortEngagement,
} from '@asap-hub/model';
import {
  CaptionCard,
  CaptionItem,
  RepresentationOfPresentersTable,
} from '@asap-hub/react-components';
import { useState } from 'react';

import {
  useAnalytics,
  usePagination,
  usePaginationParams,
  useSearch,
} from '../../hooks';
import { useAnalyticsEngagement, useEngagementPerformance } from './state';

const RepresentationOfPresenters: React.FC = () => {
  const { currentPage, pageSize } = usePaginationParams();

  const { timeRange } = useAnalytics();

  const [sort, setSort] = useState<SortEngagement>('team_asc');
  const [sortingDirection, setSortingDirection] =
    useState<EngagementSortingDirection>(engagementInitialSortingDirection);
  const { tags } = useSearch();

  const { items: data, total } = useAnalyticsEngagement({
    currentPage,
    pageSize,
    sort,
    tags,
    timeRange,
  });

  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);

  const performance = useEngagementPerformance({ timeRange });

  return (
    <>
      <CaptionCard
        legend={`'Unique Speakers: All Roles' and 'Unique Speakers: Key Personnel'
            percentage is based on 'Members'`}
      >
        <>
          <CaptionItem label="Events" {...performance.events} />
          <CaptionItem label="Total Speakers" {...performance.totalSpeakers} />
          <CaptionItem
            label="U.S.: All Roles"
            percentage
            {...performance.uniqueAllRoles}
          />
          <CaptionItem
            label="U.S.: Key Personnel"
            percentage
            {...performance.uniqueKeyPersonnel}
          />
        </>
      </CaptionCard>
      <RepresentationOfPresentersTable
        data={data}
        performance={performance}
        sort={sort}
        setSort={setSort}
        sortingDirection={sortingDirection}
        setSortingDirection={setSortingDirection}
        numberOfPages={numberOfPages}
        currentPageIndex={currentPage}
        renderPageHref={renderPageHref}
      />
    </>
  );
};

export default RepresentationOfPresenters;
