import {
  AnalyticsTeamLeadershipDataObject,
  MeetingRepAttendanceDataObject,
  OSChampionDataObject,
  PreliminaryDataSharingDataObject,
  PreprintComplianceDataObject,
  PublicationComplianceDataObject,
  TeamCollaborationDataObject,
  TeamProductivityDataObject,
  UserCollaborationDataObject,
  UserProductivityDataObject,
} from '@asap-hub/model';
import { validMetrics } from './constants';

export type Metrics = (typeof validMetrics)[number];

export type LeadershipType = Extract<
  Metrics,
  'ig-leadership' | 'wg-leadership'
>;

type LeadershipBaseDataObject = Pick<
  AnalyticsTeamLeadershipDataObject,
  'id' | 'displayName' | 'inactiveSince'
> & {
  isInactive: boolean;
};

export type IGLeadershipDataObject = LeadershipBaseDataObject &
  Pick<
    AnalyticsTeamLeadershipDataObject,
    | 'interestGroupLeadershipRoleCount'
    | 'interestGroupPreviousLeadershipRoleCount'
    | 'interestGroupMemberCount'
    | 'interestGroupPreviousMemberCount'
  >;

export type WGLeadershipDataObject = LeadershipBaseDataObject &
  Pick<
    AnalyticsTeamLeadershipDataObject,
    | 'workingGroupLeadershipRoleCount'
    | 'workingGroupPreviousLeadershipRoleCount'
    | 'workingGroupMemberCount'
    | 'workingGroupPreviousMemberCount'
  >;

export type MetricToObjectMap = {
  'os-champion': OSChampionDataObject;
  'preliminary-data-sharing': PreliminaryDataSharingDataObject;
  attendance: MeetingRepAttendanceDataObject;
  'preprint-compliance': PreprintComplianceDataObject;
  'publication-compliance': PublicationComplianceDataObject;
  'user-productivity': UserProductivityDataObject;
  'team-productivity': TeamProductivityDataObject;
  'user-collaboration': UserCollaborationDataObject;
  'team-collaboration': TeamCollaborationDataObject;
  'ig-leadership': IGLeadershipDataObject;
  'wg-leadership': WGLeadershipDataObject;
};

export type MetricObject<T extends Metrics> = MetricToObjectMap[T];
