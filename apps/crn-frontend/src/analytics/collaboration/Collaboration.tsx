import {
  resultsToStream,
  createCsvFileStream,
  GetListOptions,
} from '@asap-hub/frontend-utils';
import {
  PreliminaryDataSharingDataObject,
  PreliminaryDataSharingResponse,
  SortSharingPrelimFindings,
  SortTeamCollaboration,
  SortUserCollaboration,
  teamCollaborationInitialSortingDirection,
  TeamCollaborationSortingDirection,
  TeamCollaborationResponse,
  LimitedTimeRangeOption,
  userCollaborationInitialSortingDirection,
  UserCollaborationSortingDirection,
  UserCollaborationResponse,
} from '@asap-hub/model';
import { AnalyticsCollaborationPageBody } from '@asap-hub/react-components';
import { analytics } from '@asap-hub/routing';
import { format } from 'date-fns';
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';

import {
  useAnalytics,
  useOpensearchMetrics,
  useAnalyticsOpensearch,
  usePaginationParams,
  useSearch,
} from '../../hooks';
import { TEAM_PERFORMANCE_INITIAL_DATA } from '../utils/constants';
import { getPreliminaryDataSharing } from './api';
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
  const navigate = useNavigate();
  const { search } = useLocation();

  const { metric: metricParam, type: typeParam } = useParams<{
    metric: 'user' | 'team' | 'sharing-prelim-findings';
    type: CollaborationType;
  }>();
  const metric = (metricParam ?? 'user') as
    | 'user'
    | 'team'
    | 'sharing-prelim-findings';
  const type = typeParam as CollaborationType;

  const { timeRange, documentCategory, outputType } = useAnalytics({
    defaultTimeRange:
      metric === 'sharing-prelim-findings' ? 'last-year' : 'all',
  });
  const { tags, setTags } = useSearch();
  const { currentPage } = usePaginationParams();
  const [userSort, setUserSort] = useState<SortUserCollaboration>('user_asc');
  const [teamSort, setTeamSort] = useState<SortTeamCollaboration>('team_asc');
  const searchParams = new URLSearchParams(search);
  const sortParam = searchParams.get(
    'sort',
  ) as SortSharingPrelimFindings | null;

  const teamPrelimSharingSort: SortSharingPrelimFindings =
    sortParam &&
    [
      'team_asc',
      'team_desc',
      'percent_shared_asc',
      'percent_shared_desc',
    ].includes(sortParam)
      ? sortParam
      : 'team_asc';

  const setTeamPrelimSharingSort: React.Dispatch<
    React.SetStateAction<SortSharingPrelimFindings>
  > = (value) => {
    const currentSort = teamPrelimSharingSort;
    const newSort =
      typeof value === 'function' ? value(currentSort) : value ?? 'team_asc';

    const params = new URLSearchParams(search);
    params.set('sort', newSort);
    params.delete('currentPage');

    void navigate(
      {
        search: params.toString(),
      },
      { replace: true },
    );
  };
  const [userSortingDirection, setUserSortingDirection] =
    useState<UserCollaborationSortingDirection>(
      userCollaborationInitialSortingDirection,
    );
  const [teamSortingDirection, setTeamSortingDirection] =
    useState<TeamCollaborationSortingDirection>(
      teamCollaborationInitialSortingDirection,
    );

  const setMetric = (
    newMetric: 'user' | 'team' | 'sharing-prelim-findings',
  ) => {
    let newType: CollaborationType;

    if (newMetric === 'sharing-prelim-findings') {
      newType = undefined;
    } else {
      newType = type || 'within-team';
    }
    void navigate(
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
    void navigate(
      analytics({})
        .collaboration({})
        .collaborationPath({ metric, type: newType }).$,
    );
  };

  const preliminaryDataSharingClient =
    useAnalyticsOpensearch<PreliminaryDataSharingDataObject>(
      'preliminary-data-sharing',
    );
  const opensearchMetrics = useOpensearchMetrics();

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
        (paginationParams: Pick<GetListOptions, 'pageSize' | 'currentPage'>) =>
          getPreliminaryDataSharing(preliminaryDataSharingClient.client, {
            tags,
            timeRange: timeRange as LimitedTimeRangeOption,
            sort: teamPrelimSharingSort,
            ...paginationParams,
          }),
        preliminaryDataSharingToCSV,
        200,
      );
    }
    if (metric === 'user' && type) {
      return resultsToStream<UserCollaborationResponse>(
        createCsvFileStream(
          `collaboration_${metric}_${format(new Date(), 'MMddyy')}.csv`,
          {
            header: true,
          },
        ),
        (paginationParams: Pick<GetListOptions, 'pageSize' | 'currentPage'>) =>
          opensearchMetrics.getUserCollaboration({
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
        200,
      );
    }

    return resultsToStream<TeamCollaborationResponse>(
      createCsvFileStream(
        `collaboration_${metric}_${format(new Date(), 'MMddyy')}.csv`,
        {
          header: true,
        },
      ),
      (paginationParams: Pick<GetListOptions, 'pageSize' | 'currentPage'>) =>
        opensearchMetrics.getTeamCollaboration({
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
      200,
    );
  };

  const loadTags = async (tagQuery: string) => {
    if (metric === 'user') {
      const suggestions =
        await opensearchMetrics.getUserCollaborationTagSuggestions(tagQuery);
      return suggestions.map((value) => ({
        label: value,
        value,
      }));
    }
    if (metric === 'team') {
      const suggestions =
        await opensearchMetrics.getTeamCollaborationTagSuggestions(tagQuery);
      return suggestions.map((value) => ({
        label: value,
        value,
      }));
    }
    return [];
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
      type={metric === 'sharing-prelim-findings' ? undefined : type}
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
