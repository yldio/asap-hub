import { createCsvFileStream } from '@asap-hub/frontend-utils';
import {
  SortTeamCollaboration,
  SortUserCollaboration,
  TeamCollaborationAlgoliaResponse,
  teamCollaborationInitialSortingDirection,
  TeamCollaborationSortingDirection,
  UserCollaborationAlgoliaResponse,
  userCollaborationInitialSortingDirection,
  UserCollaborationSortingDirection,
} from '@asap-hub/model';
import { AnalyticsCollaborationPageBody } from '@asap-hub/react-components';
import { analytics } from '@asap-hub/routing';
import { format } from 'date-fns';
import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { useAnalytics, usePaginationParams, useSearch } from '../../hooks';
import { useAnalyticsAlgolia } from '../../hooks/algolia';
import { algoliaResultsToStream } from '../utils/export';
import { getAlgoliaIndexName } from '../utils/state';
import { getTeamCollaboration, getUserCollaboration } from './api';
import {
  teamCollaborationAcrossTeamToCSV,
  teamCollaborationWithinTeamToCSV,
  userCollaborationToCSV,
} from './export';
import {
  useTeamCollaborationPerformance,
  useUserCollaborationPerformance,
} from './state';
import TeamCollaboration from './TeamCollaboration';
import UserCollaboration from './UserCollaboration';

const Collaboration = () => {
  const history = useHistory();

  const { metric, type } = useParams<{
    metric: 'user' | 'team';
    type: 'within-team' | 'across-teams';
  }>();
  const { timeRange, documentCategory, outputType } = useAnalytics();
  const { tags, setTags } = useSearch();
  const { client } = useAnalyticsAlgolia();
  const { currentPage } = usePaginationParams();
  const [userSort, setUserSort] = useState<SortUserCollaboration>('user_asc');
  const [teamSort, setTeamSort] = useState<SortTeamCollaboration>('team_asc');
  const [userSortingDirection, setUserSortingDirection] =
    useState<UserCollaborationSortingDirection>(
      userCollaborationInitialSortingDirection,
    );
  const [teamSortingDirection, setTeamSortingDirection] =
    useState<TeamCollaborationSortingDirection>(
      teamCollaborationInitialSortingDirection,
    );

  const entityType =
    metric === 'user' ? 'user-collaboration' : 'team-collaboration';
  const setMetric = (newMetric: 'user' | 'team') =>
    history.push(
      analytics({})
        .collaboration({})
        .collaborationPath({ metric: newMetric, type }).$,
    );
  const setType = (newType: 'within-team' | 'across-teams') => {
    if (metric === 'user') {
      setUserSort('user_asc');
      setUserSortingDirection(userCollaborationInitialSortingDirection);
    } else {
      setTeamSort('team_asc');
      setTeamSortingDirection(teamCollaborationInitialSortingDirection);
    }
    history.push(
      analytics({})
        .collaboration({})
        .collaborationPath({ metric, type: newType }).$,
    );
  };

  const userClient = useAnalyticsAlgolia(
    getAlgoliaIndexName(userSort, 'user-collaboration'),
  ).client;
  const teamClient = useAnalyticsAlgolia(
    getAlgoliaIndexName(teamSort, 'team-collaboration'),
  ).client;

  const userPerformance = useUserCollaborationPerformance({
    timeRange,
    documentCategory,
  });

  const teamPerformance = useTeamCollaborationPerformance({
    timeRange,
    outputType,
  });

  const exportResults = () => {
    if (metric === 'user') {
      return algoliaResultsToStream<UserCollaborationAlgoliaResponse>(
        createCsvFileStream(
          `collaboration_${metric}_${format(new Date(), 'MMddyy')}.csv`,
          {
            header: true,
          },
        ),
        (paginationParams) =>
          getUserCollaboration(userClient, {
            documentCategory,
            sort: userSort,
            tags,
            timeRange,
            ...paginationParams,
          }),
        userCollaborationToCSV(type, userPerformance, documentCategory),
      );
    }

    return algoliaResultsToStream<TeamCollaborationAlgoliaResponse>(
      createCsvFileStream(
        `collaboration_${metric}_${format(new Date(), 'MMddyy')}.csv`,
        {
          header: true,
        },
      ),
      (paginationParams) =>
        getTeamCollaboration(teamClient, {
          outputType,
          sort: teamSort,
          tags,
          timeRange,
          ...paginationParams,
        }),
      type === 'within-team'
        ? teamCollaborationWithinTeamToCSV(teamPerformance, outputType)
        : teamCollaborationAcrossTeamToCSV(teamPerformance, outputType),
    );
  };

  const loadTags = async (tagQuery: string) => {
    const searchedTags = await client.searchForTagValues(
      [entityType],
      tagQuery,
      {},
    );
    return searchedTags.facetHits.map(({ value }) => ({
      label: value,
      value,
    }));
  };

  return (
    <AnalyticsCollaborationPageBody
      currentPage={currentPage}
      documentCategory={metric === 'user' ? documentCategory : undefined}
      exportResults={exportResults}
      loadTags={loadTags}
      metric={metric}
      outputType={metric === 'team' ? outputType : undefined}
      setMetric={setMetric}
      setTags={setTags}
      setType={setType}
      tags={tags}
      timeRange={timeRange}
      type={type}
    >
      {metric === 'user' ? (
        <UserCollaboration
          sort={userSort}
          setSort={setUserSort}
          setSortingDirection={setUserSortingDirection}
          sortingDirection={userSortingDirection}
          type={type}
          tags={tags}
        />
      ) : (
        <TeamCollaboration
          sort={teamSort}
          setSort={setTeamSort}
          setSortingDirection={setTeamSortingDirection}
          sortingDirection={teamSortingDirection}
          type={type}
          tags={tags}
        />
      )}
    </AnalyticsCollaborationPageBody>
  );
};

export default Collaboration;
