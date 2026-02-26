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
import { FC, Suspense, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { usePagination, usePaginationParams } from '../../hooks';
import { useAnalyticsMeetingRepAttendance } from './state';

const SORT_PARAM = 'sort';

const validSortValues: SortMeetingRepAttendance[] = [
  'team_asc',
  'team_desc',
  'attendance_percentage_asc',
  'attendance_percentage_desc',
];

export const getMeetingRepAttendanceSortFromSearch = (
  search: string,
): SortMeetingRepAttendance => {
  const params = new URLSearchParams(search);
  const sort = params.get(SORT_PARAM);
  if (sort && validSortValues.includes(sort as SortMeetingRepAttendance)) {
    return sort as SortMeetingRepAttendance;
  }
  return 'team_asc';
};

const getSortingDirectionFromSort = (
  sort: SortMeetingRepAttendance,
): MeetingRepAttendanceSortingDirection => {
  const direction = sort.endsWith('_asc') ? 'asc' : 'desc';
  const field = sort.replace(
    /_(asc|desc)$/,
    '',
  ) as keyof MeetingRepAttendanceSortingDirection;
  const fieldMap: Record<string, keyof MeetingRepAttendanceSortingDirection> = {
    team: 'team',
    attendance_percentage: 'attendancePercentage',
  };
  const key = fieldMap[field] ?? 'team';
  return {
    ...meetingRepAttendanceInitialSortingDirection,
    [key]: direction,
  };
};

interface MeetingRepAttendanceProps {
  tags: string[];
  timeRange: LimitedTimeRangeOption;
}

const MeetingRepAttendanceContent: FC<
  MeetingRepAttendanceProps & {
    sort: SortMeetingRepAttendance;
    setSort: React.Dispatch<React.SetStateAction<SortMeetingRepAttendance>>;
    sortingDirection: MeetingRepAttendanceSortingDirection;
  }
> = ({ tags, timeRange, sort, setSort, sortingDirection }) => {
  const { currentPage, pageSize } = usePaginationParams();
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
      sort={sort}
      sortingDirection={sortingDirection}
    />
  );
};

const MeetingRepAttendance: FC<MeetingRepAttendanceProps> = ({
  tags,
  timeRange,
}) => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const sort = getMeetingRepAttendanceSortFromSearch(search);
  const sortingDirection = getSortingDirectionFromSort(sort);

  const setSort = useCallback(
    (value: React.SetStateAction<SortMeetingRepAttendance>) => {
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
      <MeetingRepAttendanceContent
        tags={tags}
        timeRange={timeRange}
        sort={sort}
        setSort={setSort}
        sortingDirection={sortingDirection}
      />
    </Suspense>
  );
};

export default MeetingRepAttendance;
