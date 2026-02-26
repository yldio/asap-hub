import { createCsvFileStream, resultsToStream } from '@asap-hub/frontend-utils';
import {
  EngagementResponse,
  EngagementType,
  LimitedTimeRangeOption,
  MeetingRepAttendanceResponse,
  SortEngagement,
} from '@asap-hub/model';
import { AnalyticsEngagementPageBody } from '@asap-hub/react-components';
import { useFlags } from '@asap-hub/react-context';
import { analytics } from '@asap-hub/routing';
import { format } from 'date-fns';
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';

import {
  useAnalytics,
  useOpensearchMetrics,
  usePaginationParams,
  useSearch,
} from '../../hooks';
import { useAnalyticsAlgolia } from '../../hooks/algolia';
import { getEngagement } from './api';
import { engagementToCSV, meetingRepAttendanceToCSV } from './export';
import MeetingRepAttendance, {
  getMeetingRepAttendanceSortFromSearch,
} from './MeetingRepAttendance';
import RepresentationOfPresenters from './RepresentationOfPresenters';
import { useEngagementPerformanceValue } from './state';

const Engagement = () => {
  const { currentPage } = usePaginationParams();
  const navigate = useNavigate();
  const { search } = useLocation();
  const { timeRange } = useAnalytics();

  const { metric: metricParam } = useParams<{
    metric: EngagementType;
  }>();
  const metric = (metricParam ?? 'presenters') as EngagementType;

  const setMetric = (newMetric: EngagementType) => {
    void navigate(
      analytics({}).engagement({}).metric({
        metric: newMetric,
      }).$,
    );
  };
  const { tags, setTags } = useSearch();

  const performance = useEngagementPerformanceValue({ timeRange });
  const { client } = useAnalyticsAlgolia();
  const { isEnabled } = useFlags();
  const opensearchMetrics = useOpensearchMetrics();

  const [presenterRepresentationSort, setPresenterRepresentationSort] =
    useState<SortEngagement>('team_asc');

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
          opensearchMetrics.getMeetingRepAttendance({
            tags,
            timeRange: timeRange as LimitedTimeRangeOption,
            ...paginationParams,
            sort: getMeetingRepAttendanceSortFromSearch(search),
          }),
        meetingRepAttendanceToCSV,
        200,
      );
    }
    return resultsToStream<EngagementResponse>(
      createCsvFileStream(`engagement_${format(new Date(), 'MMddyy')}.csv`, {
        header: true,
      }),
      (paginationParams) =>
        isEnabled('OPENSEARCH_METRICS')
          ? opensearchMetrics.getPresenterRepresentation({
              sort: presenterRepresentationSort,
              timeRange,
              tags,
              ...paginationParams,
            })
          : getEngagement(client, {
              timeRange,
              tags,
              sort: presenterRepresentationSort,
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
      200,
    );
  };

  const loadTags = async (tagQuery: string) => {
    if (isAttendancePage) {
      const response =
        await opensearchMetrics.getMeetingRepAttendanceTagSuggestions(tagQuery);

      return response.map((value) => ({
        label: value,
        value,
      }));
    }
    const tagResults = isEnabled('OPENSEARCH_METRICS')
      ? await opensearchMetrics.getPresenterRepresentationTagSuggestions(
          tagQuery,
        )
      : (
          await client.searchForTagValues(['engagement'], tagQuery, {})
        ).facetHits.map(({ value }) => value);

    return tagResults.map((value) => ({
      label: value,
      value,
    }));
  };
  return (
    <AnalyticsEngagementPageBody
      exportResults={exportResults}
      tags={tags}
      setTags={setTags}
      loadTags={async (tagQuery) => loadTags(tagQuery)}
      metric={metric}
      setMetric={setMetric}
      timeRange={timeRange}
      currentPage={currentPage}
    >
      {isAttendancePage ? (
        <MeetingRepAttendance
          tags={tags}
          timeRange={timeRange as LimitedTimeRangeOption}
        />
      ) : (
        <RepresentationOfPresenters
          setSort={setPresenterRepresentationSort}
          sort={presenterRepresentationSort}
          tags={tags}
          timeRange={timeRange}
        />
      )}
    </AnalyticsEngagementPageBody>
  );
};
export default Engagement;
