import {
  MeetingRepAttendanceSortingDirection,
  meetingRepAttendanceInitialSortingDirection,
  SortMeetingRepAttendance,
  LimitedTimeRangeOption,
} from '@asap-hub/model';
import {
  LoadingContentBodyTable,
  MeetingRepAttendanceTable,
} from '@asap-hub/react-components';
import { FC, Suspense, useState } from 'react';
import { usePagination, usePaginationParams } from '../../hooks';
import { useAnalyticsMeetingRepAttendance } from './state';

interface MeetingRepAttendanceProps {
  tags: string[];
  timeRange: LimitedTimeRangeOption;
}

const MeetingRepAttendanceContent: FC<MeetingRepAttendanceProps> = ({
  tags,
  timeRange,
}) => {
  const { currentPage, pageSize } = usePaginationParams();
  const [sort, setSort] = useState<SortMeetingRepAttendance>('team_asc');
  const [sortingDirection, setSortingDirection] =
    useState<MeetingRepAttendanceSortingDirection>(
      meetingRepAttendanceInitialSortingDirection,
    );
  const { items, total } = useAnalyticsMeetingRepAttendance({
    currentPage,
    pageSize,
    sort,
    tags,
    timeRange,
  });

  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);

  return (
    <MeetingRepAttendanceTable
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

const MeetingRepAttendance: FC<MeetingRepAttendanceProps> = ({
  tags,
  timeRange,
}) => (
  <Suspense fallback={<LoadingContentBodyTable />}>
    <MeetingRepAttendanceContent tags={tags} timeRange={timeRange} />
  </Suspense>
);

export default MeetingRepAttendance;
