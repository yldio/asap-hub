import { resultsToStream, createCsvFileStream } from '@asap-hub/frontend-utils';
import {
  SortTeamProductivity,
  SortUserProductivity,
  UserProductivityPerformance,
  TeamProductivityPerformance,
  UserProductivityResponse,
  TeamProductivityResponse,
} from '@asap-hub/model';
import { AnalyticsProductivityPageBody } from '@asap-hub/react-components';
import { analytics } from '@asap-hub/routing';
import { format } from 'date-fns';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  useAnalytics,
  useOpensearchMetrics,
  usePaginationParams,
  useSearch,
} from '../../hooks';
import { teamProductivityToCSV, userProductivityToCSV } from './export';
import {
  useTeamProductivityPerformanceValue,
  useUserProductivityPerformanceValue,
} from './state';

import TeamProductivity from './TeamProductivity';
import UserProductivity from './UserProductivity';

const Productivity = () => {
  const navigate = useNavigate();
  const { currentPage } = usePaginationParams();

  const { metric: metricParam } = useParams<{ metric: 'user' | 'team' }>();
  const metric = (metricParam ?? 'user') as 'user' | 'team';
  const setMetric = (newMetric: 'user' | 'team') =>
    navigate(analytics({}).productivity({}).metric({ metric: newMetric }).$);

  const { timeRange, documentCategory, outputType } = useAnalytics();
  const { tags, setTags } = useSearch();
  const opensearchMetrics = useOpensearchMetrics();

  const entityType =
    metric === 'user' ? 'user-productivity' : 'team-productivity';

  const [userSort, setUserSort] = useState<SortUserProductivity>('user_asc');
  const [teamSort, setTeamSort] = useState<SortTeamProductivity>('team_asc');

  const emptyPerformanceMetrics = {
    belowAverageMin: 0,
    belowAverageMax: 0,
    averageMin: 0,
    averageMax: 0,
    aboveAverageMin: 0,
    aboveAverageMax: 0,
  };

  const defaultUserPerformance: UserProductivityPerformance = {
    asapOutput: emptyPerformanceMetrics,
    asapPublicOutput: emptyPerformanceMetrics,
    ratio: emptyPerformanceMetrics,
  };

  const defaultTeamPerformance: TeamProductivityPerformance = {
    article: emptyPerformanceMetrics,
    bioinformatics: emptyPerformanceMetrics,
    dataset: emptyPerformanceMetrics,
    labMaterial: emptyPerformanceMetrics,
    protocol: emptyPerformanceMetrics,
  };

  const userPerformanceValue = useUserProductivityPerformanceValue({
    timeRange,
    documentCategory,
  });
  const teamPerformanceValue = useTeamProductivityPerformanceValue({
    timeRange,
    outputType,
  });

  const exportResults = async () => {
    if (metric === 'user') {
      return resultsToStream<UserProductivityResponse>(
        createCsvFileStream(
          `productivity_${metric}_${format(new Date(), 'MMddyy')}.csv`,
          {
            header: true,
          },
        ),
        (paginationParams) =>
          opensearchMetrics.getUserProductivity({
            sort: userSort,
            timeRange,
            documentCategory,
            tags,
            ...paginationParams,
          }),
        userProductivityToCSV(userPerformanceValue ?? defaultUserPerformance),
        200,
      );
    }

    return resultsToStream<TeamProductivityResponse>(
      createCsvFileStream(
        `productivity_${metric}_${format(new Date(), 'MMddyy')}.csv`,
        {
          header: true,
        },
      ),
      (paginationParams) =>
        opensearchMetrics.getTeamProductivity({
          sort: teamSort,
          timeRange,
          outputType,
          tags,
          ...paginationParams,
        }),
      teamProductivityToCSV(teamPerformanceValue ?? defaultTeamPerformance),
      200,
    );
  };

  return (
    <AnalyticsProductivityPageBody
      metric={metric}
      setMetric={setMetric}
      outputType={metric === 'team' ? outputType : undefined}
      timeRange={timeRange}
      documentCategory={metric === 'user' ? documentCategory : undefined}
      currentPage={currentPage}
      exportResults={exportResults}
      tags={tags}
      setTags={setTags}
      loadTags={async (tagQuery) => {
        const tagResults =
          entityType === 'user-productivity'
            ? await opensearchMetrics.getUserProductivityTagSuggestions(
                tagQuery,
              )
            : await opensearchMetrics.getTeamProductivityTagSuggestions(
                tagQuery,
              );

        return tagResults.map((value) => ({
          label: value,
          value,
        }));
      }}
    >
      {metric === 'user' ? (
        <UserProductivity sort={userSort} setSort={setUserSort} tags={tags} />
      ) : (
        <TeamProductivity sort={teamSort} setSort={setTeamSort} tags={tags} />
      )}
    </AnalyticsProductivityPageBody>
  );
};

export default Productivity;
