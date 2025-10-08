import { isEnabled } from '@asap-hub/flags';
import { resultsToStream, createCsvFileStream } from '@asap-hub/frontend-utils';
import {
  PreliminaryDataSharingDataObject,
  PreliminaryDataSharingResponse,
  SortSharingPrelimFindings,
  SortTeamCollaboration,
  SortUserCollaboration,
  TeamCollaborationAlgoliaResponse,
  teamCollaborationInitialSortingDirection,
  TeamCollaborationSortingDirection,
  LimitedTimeRangeOption,
  UserCollaborationAlgoliaResponse,
  userCollaborationInitialSortingDirection,
  UserCollaborationSortingDirection,
} from '@asap-hub/model';
import { AnalyticsCollaborationPageBody } from '@asap-hub/react-components';
import { analytics } from '@asap-hub/routing';
import { format } from 'date-fns';
import { useState } from 'react';
import { Redirect, useHistory, useParams } from 'react-router-dom';

import {
  useAnalytics,
  useAnalyticsOpensearch,
  usePaginationParams,
  useSearch,
} from '../../hooks';
import { useAnalyticsAlgolia } from '../../hooks/algolia';
import { TEAM_PERFORMANCE_INITIAL_DATA } from '../utils/constants';
import { getAlgoliaIndexName } from '../utils/state';
import {
  getTeamCollaboration,
  getUserCollaboration,
  getPreliminaryDataSharing,
} from './api';
import {
  teamCollaborationAcrossTeamToCSV,
  teamCollaborationWithinTeamToCSV,
  userCollaborationToCSV,
  preliminaryDataSharingToCSV,
} from './export';
import SharingPreliminaryFindings from './SharingPrelimFindings';
import {
  useTeamCollaborationPerformanceValue,
  useUserCollaborationPerformanceValue,
} from './state';
import TeamCollaboration from './TeamCollaboration';
import UserCollaboration from './UserCollaboration';

type CollaborationType = 'within-team' | 'across-teams' | undefined;

const Collaboration = () => {
  const history = useHistory();

  const { metric, type } = useParams<{
    metric: 'user' | 'team' | 'sharing-prelim-findings';
    type: CollaborationType;
  }>();

  const { timeRange, documentCategory, outputType } = useAnalytics();
  const { tags, setTags } = useSearch();
  const { client } = useAnalyticsAlgolia();
  const { currentPage } = usePaginationParams();
  const [userSort, setUserSort] = useState<SortUserCollaboration>('user_asc');
  const [teamSort, setTeamSort] = useState<SortTeamCollaboration>('team_asc');
  const [teamPrelimSharingSort, setTeamPrelimSharingSort] =
    useState<SortSharingPrelimFindings>('team_asc');
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
  const setMetric = (
    newMetric: 'user' | 'team' | 'sharing-prelim-findings',
  ) => {
    let newType: CollaborationType;

    if (newMetric === 'sharing-prelim-findings') {
      newType = undefined;
    } else {
      newType = type || 'within-team';
    }
    history.push(
      analytics({}).collaboration({}).collaborationPath({
        metric: newMetric,
        type: newType,
      }).$,
    );
  };
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

  const preliminaryDataSharingClient =
    useAnalyticsOpensearch<PreliminaryDataSharingDataObject>(
      'preliminary-data-sharing',
    );
  const userClient = useAnalyticsAlgolia(
    getAlgoliaIndexName(userSort, 'user-collaboration'),
  ).client;
  const teamClient = useAnalyticsAlgolia(
    getAlgoliaIndexName(teamSort, 'team-collaboration'),
  ).client;

  const userPerformance = useUserCollaborationPerformanceValue({
    timeRange,
    documentCategory,
  });

  const teamPerformance = useTeamCollaborationPerformanceValue({
    timeRange,
    outputType,
  });

  const exportResults = () => {
    if (metric === 'sharing-prelim-findings') {
      return resultsToStream<PreliminaryDataSharingResponse>(
        createCsvFileStream(
          `collaboration_${metric}_${format(new Date(), 'MMddyy')}.csv`,
          {
            header: true,
          },
        ),
        (paginationParams) =>
          getPreliminaryDataSharing(preliminaryDataSharingClient.client, {
            tags,
            timeRange: timeRange as LimitedTimeRangeOption,
            ...paginationParams,
          }),
        preliminaryDataSharingToCSV,
      );
    }
    if (metric === 'user' && type) {
      return resultsToStream<UserCollaborationAlgoliaResponse>(
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
        userCollaborationToCSV(
          type,
          userPerformance ?? {
            withinTeam: {
              belowAverageMin: 0,
              belowAverageMax: 0,
              averageMin: 0,
              averageMax: 0,
              aboveAverageMin: 0,
              aboveAverageMax: 0,
            },
            acrossTeam: {
              belowAverageMin: 0,
              belowAverageMax: 0,
              averageMin: 0,
              averageMax: 0,
              aboveAverageMin: 0,
              aboveAverageMax: 0,
            },
          },
          documentCategory,
        ),
      );
    }

    return resultsToStream<TeamCollaborationAlgoliaResponse>(
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
        ? teamCollaborationWithinTeamToCSV(
            teamPerformance ?? TEAM_PERFORMANCE_INITIAL_DATA,
            outputType,
          )
        : teamCollaborationAcrossTeamToCSV(
            teamPerformance ?? TEAM_PERFORMANCE_INITIAL_DATA,
            outputType,
          ),
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

  const isPrelimSharingEnabled = isEnabled('ANALYTICS_PHASE_TWO');
  return !isPrelimSharingEnabled && metric === 'sharing-prelim-findings' ? (
    <Redirect
      to={
        analytics({})
          .collaboration({})
          .collaborationPath({ metric: 'user', type: 'within-team' }).$
      }
    />
  ) : (
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
      type={metric === 'sharing-prelim-findings' ? undefined : type}
      isPrelimSharingEnabled={isPrelimSharingEnabled}
    >
      {metric === 'user' && type ? (
        <UserCollaboration
          sort={userSort}
          setSort={setUserSort}
          setSortingDirection={setUserSortingDirection}
          sortingDirection={userSortingDirection}
          type={type}
          tags={tags}
        />
      ) : metric === 'team' && type ? (
        <TeamCollaboration
          sort={teamSort}
          setSort={setTeamSort}
          setSortingDirection={setTeamSortingDirection}
          sortingDirection={teamSortingDirection}
          type={type}
          tags={tags}
        />
      ) : (
        <SharingPreliminaryFindings
          sort={teamPrelimSharingSort}
          setSort={setTeamPrelimSharingSort}
          tags={tags}
          timeRange={timeRange as LimitedTimeRangeOption}
        />
      )}
    </AnalyticsCollaborationPageBody>
  );
};

export default Collaboration;
