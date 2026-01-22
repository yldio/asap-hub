import {
  MeetingRepAttendanceResponse,
  OSChampionOpensearchResponse,
  PreliminaryDataSharingDataObject,
  PreprintComplianceOpensearchResponse,
  PublicationComplianceOpensearchResponse,
  TeamProductivityPerformanceDataObject,
  TeamProductivityResponse,
  UserProductivityPerformanceDataObject,
  UserProductivityResponse,
  UserCollaborationResponse,
  TeamCollaborationReponse,
  TeamCollaborationPerformance,
  UserCollaborationPerformance,
} from '@asap-hub/model';
import { useRecoilValue } from 'recoil';
import {
  getTeamProductivity,
  getTeamProductivityPerformance,
  getUserProductivity,
  getUserProductivityPerformance,
} from '../analytics/productivity/api';
import {
  getUserCollaboration,
  getUserCollaborationPerformance,
  getTeamCollaboration,
  getTeamCollaborationPerformance,
  getPreliminaryDataSharing,
} from '../analytics/collaboration/api';
import { getMeetingRepAttendance } from '../analytics/engagement/api';
import { getAnalyticsOSChampion } from '../analytics/leadership/api';
import {
  getPublicationCompliance,
  getPreprintCompliance,
} from '../analytics/open-science/api';
import {
  OpensearchClient,
  OpensearchIndex,
} from '../analytics/utils/opensearch';
import { authorizationState } from '../auth/state';

export const useAnalyticsOpensearch = <T>(index: OpensearchIndex) => {
  const authorization = useRecoilValue(authorizationState);
  const client = new OpensearchClient<T>(index, authorization);
  return {
    client,
  };
};

/**
 * Façade to all metrics stored in OpenSearch.
 */
export const useOpensearchMetrics = () => {
  const authorization = useRecoilValue(authorizationState);

  return {
    getPublicationCompliance(
      paginationParams: Parameters<typeof getPublicationCompliance>[1],
    ) {
      const client =
        new OpensearchClient<PublicationComplianceOpensearchResponse>(
          'publication-compliance',
          authorization,
        );
      return getPublicationCompliance(client, paginationParams);
    },

    getPreprintCompliance(
      paginationParams: Parameters<typeof getPreprintCompliance>[1],
    ) {
      const client = new OpensearchClient<PreprintComplianceOpensearchResponse>(
        'preprint-compliance',
        authorization,
      );
      return getPreprintCompliance(client, paginationParams);
    },

    getAnalyticsOSChampion(
      paginationParams: Parameters<typeof getAnalyticsOSChampion>[1],
    ) {
      const client = new OpensearchClient<OSChampionOpensearchResponse>(
        'os-champion',
        authorization,
      );
      return getAnalyticsOSChampion(client, paginationParams);
    },

    getMeetingRepAttendance(
      paginationParams: Parameters<typeof getMeetingRepAttendance>[1],
    ) {
      const client = new OpensearchClient<MeetingRepAttendanceResponse>(
        'attendance',
        authorization,
      );
      return getMeetingRepAttendance(client, paginationParams);
    },

    getPreliminaryDataSharing(
      paginationParams: Parameters<typeof getPreliminaryDataSharing>[1],
    ) {
      const client = new OpensearchClient<PreliminaryDataSharingDataObject>(
        'preliminary-data-sharing',
        authorization,
      );
      return getPreliminaryDataSharing(client, paginationParams);
    },

    getUserProductivity(
      paginationParams: Parameters<typeof getUserProductivity>[1],
    ) {
      const client = new OpensearchClient<UserProductivityResponse>(
        'user-productivity',
        authorization,
      );
      return getUserProductivity(client, paginationParams);
    },

    getUserProductivityTagSuggestions(tagQuery: string) {
      const client = new OpensearchClient<UserProductivityResponse>(
        'user-productivity',
        authorization,
      );
      return client.getTagSuggestions(tagQuery, 'extended');
    },

    getUserProductivityPerformance(
      paginationParams: Parameters<typeof getUserProductivityPerformance>[1],
    ) {
      const client =
        new OpensearchClient<UserProductivityPerformanceDataObject>(
          'user-productivity-performance',
          authorization,
        );
      return getUserProductivityPerformance(client, paginationParams);
    },

    getTeamProductivity(
      paginationParams: Parameters<typeof getTeamProductivity>[1],
    ) {
      const client = new OpensearchClient<TeamProductivityResponse>(
        'team-productivity',
        authorization,
      );
      return getTeamProductivity(client, paginationParams);
    },

    getTeamProductivityTagSuggestions(tagQuery: string) {
      const client = new OpensearchClient<TeamProductivityResponse>(
        'team-productivity',
        authorization,
      );
      return client.getTagSuggestions(tagQuery, 'flat');
    },

    getTeamProductivityPerformance(
      paginationParams: Parameters<typeof getTeamProductivityPerformance>[1],
    ) {
      const client =
        new OpensearchClient<TeamProductivityPerformanceDataObject>(
          'team-productivity-performance',
          authorization,
        );
      return getTeamProductivityPerformance(client, paginationParams);
    },

    getUserCollaboration(
      paginationParams: Parameters<typeof getUserCollaboration>[1],
    ) {
      const client = new OpensearchClient<UserCollaborationResponse>(
        'user-collaboration',
        authorization,
      );
      return getUserCollaboration(client, paginationParams);
    },

    getUserCollaborationTagSuggestions(tagQuery: string) {
      const client = new OpensearchClient<UserCollaborationResponse>(
        'user-collaboration',
        authorization,
      );
      return client.getTagSuggestions(tagQuery, 'extended');
    },

    getUserCollaborationPerformance(
      paginationParams: Parameters<typeof getUserCollaborationPerformance>[1],
    ) {
      const client = new OpensearchClient<UserCollaborationPerformance>(
        'user-collaboration-performance',
        authorization,
      );
      return getUserCollaborationPerformance(client, paginationParams);
    },

    getTeamCollaboration(
      paginationParams: Parameters<typeof getTeamCollaboration>[1],
    ) {
      const client = new OpensearchClient<TeamCollaborationReponse>(
        'team-collaboration',
        authorization,
      );
      return getTeamCollaboration(client, paginationParams);
    },

    getTeamCollaborationTagSuggestions(tagQuery: string) {
      const client = new OpensearchClient<TeamCollaborationReponse>(
        'team-collaboration',
        authorization,
      );
      return client.getTagSuggestions(tagQuery, 'extended');
    },

    getTeamCollaborationPerformance(
      paginationParams: Parameters<typeof getTeamCollaborationPerformance>[1],
    ) {
      const client = new OpensearchClient<TeamCollaborationPerformance>(
        'team-collaboration-performance',
        authorization,
      );
      return getTeamCollaborationPerformance(client, paginationParams);
    },
  } as const;
};

export type OpensearchMetricsFacade = ReturnType<typeof useOpensearchMetrics>;
