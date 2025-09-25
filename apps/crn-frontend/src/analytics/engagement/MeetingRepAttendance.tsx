import {
  MeetingRepAttendanceSortingDirection,
  meetingRepAttendanceInitialSortingDirection,
  SortMeetingRepAttendance,
  TimeRangeOptionPreliminaryDataSharing,
} from '@asap-hub/model';
import { MeetingRepAttendanceTable } from '@asap-hub/react-components';
import { useState } from 'react';
import { usePagination, usePaginationParams } from '../../hooks';
import { useAnalyticsMeetingRepAttendance } from './state';

interface MeetingRepAttendanceProps {
  tags: string[];
  timeRange: TimeRangeOptionPreliminaryDataSharing;
}

const MeetingRepAttendance: React.FC<MeetingRepAttendanceProps> = ({
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

export default MeetingRepAttendance;
