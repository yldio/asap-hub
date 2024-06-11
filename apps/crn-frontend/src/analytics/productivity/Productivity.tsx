import { createCsvFileStream } from '@asap-hub/frontend-utils';
import {
  SortTeamProductivity,
  SortUserProductivity,
  TeamProductivityAlgoliaResponse,
  UserProductivityAlgoliaResponse,
} from '@asap-hub/model';
import { AnalyticsProductivityPageBody } from '@asap-hub/react-components';
import { analytics } from '@asap-hub/routing';
import { format } from 'date-fns';
import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useAnalytics, usePaginationParams } from '../../hooks';
import { algoliaResultsToStream } from '../leadership/export';
import { getTeamProductivity, getUserProductivity } from './api';
import { teamProductivityToCSV, userProductivityToCSV } from './export';
import {
  useAnalyticsTeamProductivity,
  useAnalyticsUserProductivity,
  useTeamProductivityPerformance,
  useUserProductivityPerformance,
} from './state';

import TeamProductivity from './TeamProductivity';
import UserProductivity from './UserProductivity';

const Productivity = () => {
  const history = useHistory();
  const { currentPage, pageSize } = usePaginationParams();

  const { metric } = useParams<{ metric: 'user' | 'team' }>();
  const setMetric = (newMetric: 'user' | 'team') =>
    history.push(
      analytics({}).productivity({}).metric({ metric: newMetric }).$,
    );

  const { timeRange } = useAnalytics();

  const [userSort, setUserSort] = useState<SortUserProductivity>('user_asc');
  const [teamSort, setTeamSort] = useState<SortTeamProductivity>('team_asc');

  const { client: userClient } = useAnalyticsUserProductivity({
    currentPage,
    pageSize,
    timeRange,
    sort: userSort,
  });
  const userPerformance = useUserProductivityPerformance(timeRange);

  const { client: teamClient } = useAnalyticsTeamProductivity({
    currentPage,
    pageSize,
    timeRange,
    sort: teamSort,
  });
  const teamPerformance = useTeamProductivityPerformance(timeRange);

  const exportResults = () => {
    if (metric === 'user') {
      return algoliaResultsToStream<UserProductivityAlgoliaResponse>(
        createCsvFileStream(
          `productivity_${metric}_${format(new Date(), 'MMddyy')}.csv`,
          {
            header: true,
          },
        ),
        (paginationParams) =>
          getUserProductivity(userClient, {
            sort: userSort,
            timeRange,
            ...paginationParams,
          }),
        userProductivityToCSV(userPerformance),
      );
    } else {
      return algoliaResultsToStream<TeamProductivityAlgoliaResponse>(
        createCsvFileStream(
          `productivity_${metric}_${format(new Date(), 'MMddyy')}.csv`,
          {
            header: true,
          },
        ),
        (paginationParams) =>
          getTeamProductivity(teamClient, {
            sort: teamSort,
            timeRange,
            ...paginationParams,
          }),
        teamProductivityToCSV(teamPerformance),
      );
    }
  };

  return (
    <AnalyticsProductivityPageBody
      metric={metric}
      setMetric={setMetric}
      timeRange={timeRange}
      currentPage={currentPage}
      exportResults={exportResults}
    >
      {metric === 'user' ? (
        <UserProductivity sort={userSort} setSort={setUserSort} />
      ) : (
        <TeamProductivity sort={teamSort} setSort={setTeamSort} />
      )}
    </AnalyticsProductivityPageBody>
  );
};

export default Productivity;
