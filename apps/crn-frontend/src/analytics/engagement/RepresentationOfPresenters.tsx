import {
  engagementInitialSortingDirection,
  EngagementSortingDirection,
  SortEngagement,
  TimeRangeOption,
} from '@asap-hub/model';
import {
  CaptionCard,
  CaptionItem,
  RepresentationOfPresentersTable,
} from '@asap-hub/react-components';
import { useState } from 'react';

import { usePagination, usePaginationParams } from '../../hooks';
import { useAnalyticsEngagement, useEngagementPerformance } from './state';

interface RepresentationOfPresentersProps {
  tags: string[];
  timeRange: TimeRangeOption;
}

const RepresentationOfPresenters: React.FC<RepresentationOfPresentersProps> = ({
  tags,
  timeRange,
}) => {
  const { currentPage, pageSize } = usePaginationParams();

  const [sort, setSort] = useState<SortEngagement>('team_asc');
  const [sortingDirection, setSortingDirection] =
    useState<EngagementSortingDirection>(engagementInitialSortingDirection);

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
