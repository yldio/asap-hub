import { resultsToStream, createCsvFileStream } from '@asap-hub/frontend-utils';
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
import { getAlgoliaIndexName } from '../utils/state';
import { getTeamProductivity, getUserProductivity } from './api';
import { teamProductivityToCSV, userProductivityToCSV } from './export';
import {
  useTeamProductivityPerformance,
  useUserProductivityPerformance,
} from './state';

import TeamProductivity from './TeamProductivity';
import UserProductivity from './UserProductivity';

const Productivity = () => {
  const history = useHistory();
  const { currentPage } = usePaginationParams();

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

  const userClient = useAnalyticsAlgolia(
    getAlgoliaIndexName(userSort, 'user-productivity'),
  ).client;
  const userPerformance = useUserProductivityPerformance({
    timeRange,
    documentCategory,
  });

  const teamClient = useAnalyticsAlgolia(
    getAlgoliaIndexName(teamSort, 'team-productivity'),
  ).client;

  const teamPerformance = useTeamProductivityPerformance({
    timeRange,
    outputType,
  });

  const exportResults = () => {
    if (metric === 'user') {
      return resultsToStream<UserProductivityAlgoliaResponse>(
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

    return resultsToStream<TeamProductivityAlgoliaResponse>(
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
          outputType,
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
      outputType={metric === 'team' ? outputType : undefined}
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
