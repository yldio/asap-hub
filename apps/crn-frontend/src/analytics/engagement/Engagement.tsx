import { isEnabled } from '@asap-hub/flags';
import { resultsToStream, createCsvFileStream } from '@asap-hub/frontend-utils';
import {
  EngagementResponse,
  EngagementType,
  TimeRangeOptionPreliminaryDataSharing,
} from '@asap-hub/model';
import { AnalyticsEngagementPageBody } from '@asap-hub/react-components';
import { analytics } from '@asap-hub/routing';
import { format } from 'date-fns';
import { Redirect, useHistory, useParams } from 'react-router-dom';

import { useAnalytics, usePaginationParams, useSearch } from '../../hooks';
import { useAnalyticsAlgolia } from '../../hooks/algolia';
import { getEngagement } from './api';
import { engagementToCSV } from './export';
import MeetingRepAttendance from './MeetingRepAttendance';
import RepresentationOfPresenters from './RepresentationOfPresenters';
import { useEngagementPerformance } from './state';

const Engagement = () => {
  const { currentPage } = usePaginationParams();
  const history = useHistory();
  const { timeRange } = useAnalytics();

  const { metric } = useParams<{
    metric: EngagementType;
  }>();

  const setMetric = (newMetric: EngagementType) => {
    history.push(
      analytics({}).engagement({}).metric({
        metric: newMetric,
      }).$,
    );
  };
  const { tags, setTags } = useSearch();

  const isMeetingRepAttendanceEnabled = isEnabled('ANALYTICS_PHASE_TWO');

  const performance = useEngagementPerformance({ timeRange });
  const { client } = useAnalyticsAlgolia();
  const exportResults = () =>
    resultsToStream<EngagementResponse>(
      createCsvFileStream(`engagement_${format(new Date(), 'MMddyy')}.csv`, {
        header: true,
      }),
      (paginationParams) =>
        getEngagement(client, {
          timeRange,
          tags,
          ...paginationParams,
        }),
      engagementToCSV(performance),
    );
  return !isMeetingRepAttendanceEnabled && metric === 'attendance' ? (
    <Redirect
      to={analytics({}).engagement({}).metric({ metric: 'presenters' }).$}
    />
  ) : (
    <AnalyticsEngagementPageBody
      exportResults={exportResults}
      tags={tags}
      setTags={setTags}
      loadTags={async (tagQuery) => {
        const searchedTags = await client.searchForTagValues(
          ['engagement'],
          tagQuery,
          {},
        );
        return searchedTags.facetHits.map(({ value }) => ({
          label: value,
          value,
        }));
      }}
      isMeetingRepAttendanceEnabled={isMeetingRepAttendanceEnabled}
      metric={metric}
      setMetric={setMetric}
      timeRange={timeRange}
      currentPage={currentPage}
    >
      {metric === 'attendance' && isMeetingRepAttendanceEnabled ? (
        <MeetingRepAttendance
          tags={tags}
          timeRange={timeRange as TimeRangeOptionPreliminaryDataSharing}
        />
      ) : (
        <RepresentationOfPresenters tags={tags} timeRange={timeRange} />
      )}
    </AnalyticsEngagementPageBody>
  );
};
export default Engagement;
