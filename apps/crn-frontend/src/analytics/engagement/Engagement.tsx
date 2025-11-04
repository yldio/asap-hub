import { isEnabled } from '@asap-hub/flags';
import { resultsToStream, createCsvFileStream } from '@asap-hub/frontend-utils';
import {
  EngagementResponse,
  EngagementType,
  LimitedTimeRangeOption,
  MeetingRepAttendanceResponse,
} from '@asap-hub/model';
import { AnalyticsEngagementPageBody } from '@asap-hub/react-components';
import { analytics } from '@asap-hub/routing';
import { format } from 'date-fns';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import {
  useAnalytics,
  useAnalyticsOpensearch,
  usePaginationParams,
  useSearch,
} from '../../hooks';
import { useAnalyticsAlgolia } from '../../hooks/algolia';
import { getEngagement, getMeetingRepAttendance } from './api';
import { engagementToCSV, meetingRepAttendanceToCSV } from './export';
import MeetingRepAttendance from './MeetingRepAttendance';
import RepresentationOfPresenters from './RepresentationOfPresenters';
import { useEngagementPerformanceValue } from './state';

const Engagement = () => {
  const { currentPage } = usePaginationParams();
  const navigate = useNavigate();
  const { timeRange } = useAnalytics();

  const { metric } = useParams<{
    metric: EngagementType;
  }>();

  const setMetric = (newMetric: EngagementType) => {
    navigate(
      analytics({}).engagement({}).metric({
        metric: newMetric,
      }).$,
    );
  };
  const { tags, setTags } = useSearch();

  const isMeetingRepAttendanceEnabled = isEnabled('ANALYTICS_PHASE_TWO');

  const performance = useEngagementPerformanceValue({ timeRange });
  const { client } = useAnalyticsAlgolia();
  const attendanceClient =
    useAnalyticsOpensearch<MeetingRepAttendanceResponse>('attendance');
  const isAttendancePage = metric === 'attendance';

  const exportResults = () => {
    if (isAttendancePage) {
      return resultsToStream<MeetingRepAttendanceResponse>(
        createCsvFileStream(
          `engagement_${metric}_${format(new Date(), 'MMddyy')}.csv`,
          {
            header: true,
          },
        ),
        (paginationParams) =>
          getMeetingRepAttendance(attendanceClient.client, {
            tags,
            timeRange: timeRange as LimitedTimeRangeOption,
            ...paginationParams,
            sort: 'team_asc',
          }),
        meetingRepAttendanceToCSV,
      );
    }
    return resultsToStream<EngagementResponse>(
      createCsvFileStream(`engagement_${format(new Date(), 'MMddyy')}.csv`, {
        header: true,
      }),
      (paginationParams) =>
        getEngagement(client, {
          timeRange,
          tags,
          ...paginationParams,
        }),
      engagementToCSV(
        performance ?? {
          events: {
            belowAverageMin: 0,
            belowAverageMax: 0,
            averageMin: 0,
            averageMax: 0,
            aboveAverageMin: 0,
            aboveAverageMax: 0,
          },
          totalSpeakers: {
            belowAverageMin: 0,
            belowAverageMax: 0,
            averageMin: 0,
            averageMax: 0,
            aboveAverageMin: 0,
            aboveAverageMax: 0,
          },
          uniqueAllRoles: {
            belowAverageMin: 0,
            belowAverageMax: 0,
            averageMin: 0,
            averageMax: 0,
            aboveAverageMin: 0,
            aboveAverageMax: 0,
          },
          uniqueKeyPersonnel: {
            belowAverageMin: 0,
            belowAverageMax: 0,
            averageMin: 0,
            averageMax: 0,
            aboveAverageMin: 0,
            aboveAverageMax: 0,
          },
        },
      ),
    );
  };

  const loadTags = async (tagQuery: string) => {
    if (isAttendancePage) {
      const response = await attendanceClient.client.getTagSuggestions(
        tagQuery,
        'flat',
      );

      return response.map((value) => ({
        label: value,
        value,
      }));
    }
    const searchedTags = await client.searchForTagValues(
      ['engagement'],
      tagQuery,
      {},
    );
    return searchedTags.facetHits.map(({ value }) => ({
      label: value,
      value,
    }));
  };
  return !isMeetingRepAttendanceEnabled && isAttendancePage ? (
    <Navigate
      to={analytics({}).engagement({}).metric({ metric: 'presenters' }).$}
      replace
    />
  ) : (
    <AnalyticsEngagementPageBody
      exportResults={exportResults}
      tags={tags}
      setTags={setTags}
      loadTags={async (tagQuery) => loadTags(tagQuery)}
      isMeetingRepAttendanceEnabled={isMeetingRepAttendanceEnabled}
      metric={metric}
      setMetric={setMetric}
      timeRange={timeRange}
      currentPage={currentPage}
    >
      {isAttendancePage && isMeetingRepAttendanceEnabled ? (
        <MeetingRepAttendance
          tags={tags}
          timeRange={timeRange as LimitedTimeRangeOption}
        />
      ) : (
        <RepresentationOfPresenters tags={tags} timeRange={timeRange} />
      )}
    </AnalyticsEngagementPageBody>
  );
};
export default Engagement;
