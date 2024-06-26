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
import { useAnalytics, usePaginationParams, useSearch } from '../../hooks';
import { useAnalyticsAlgolia } from '../../hooks/algolia';
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

  const { timeRange, documentCategory, outputType } = useAnalytics();
  const { tags, setTags } = useSearch();
  const { client } = useAnalyticsAlgolia();

  const entityType =
    metric === 'user' ? 'user-productivity' : 'team-productivity';

  const [userSort, setUserSort] = useState<SortUserProductivity>('user_asc');
  const [teamSort, setTeamSort] = useState<SortTeamProductivity>('team_asc');

  const { client: userClient } = useAnalyticsUserProductivity({
    currentPage,
    pageSize,
    timeRange,
    documentCategory,
    tags,
    sort: userSort,
  });
  const userPerformance = useUserProductivityPerformance({
    timeRange,
    documentCategory,
  });

  const { client: teamClient } = useAnalyticsTeamProductivity({
    currentPage,
    pageSize,
    timeRange,
    outputType,
    tags,
    sort: teamSort,
  });
  const teamPerformance = useTeamProductivityPerformance(timeRange, outputType);

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
            documentCategory,
            tags,
            ...paginationParams,
          }),
        userProductivityToCSV(userPerformance),
      );
    }

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
          tags,
          ...paginationParams,
        }),
      teamProductivityToCSV(teamPerformance),
    );
  };

  return (
    <AnalyticsProductivityPageBody
      metric={metric}
      setMetric={setMetric}
      outputType={outputType}
      timeRange={timeRange}
      documentCategory={metric === 'user' ? documentCategory : undefined}
      currentPage={currentPage}
      exportResults={exportResults}
      tags={tags}
      setTags={setTags}
      loadTags={async (tagQuery) => {
        const searchedTags = await client.searchForTagValues(
          [entityType],
          tagQuery,
          {},
        );
        return searchedTags.facetHits.map(({ value }) => ({
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
