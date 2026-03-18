import {
  AnalyticsTeamLeadershipDataObject,
  EngagementDataObject,
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

export type PresenterRepresentationDataObject = EngagementDataObject & {
  isInactive: boolean;
};

export type ProjectMilestonesDataObject = {
  id: string;
  description: string;
  /** Comma-separated aim numbers in ascending order, e.g. "1", "1,2", "2,3,4". */
  aimNumbersAsc: string;
  /** Same aim numbers but reversed, for descending sort, e.g. "4,3,2". */
  aimNumbersDesc: string;
  status: string;
  articleCount: number;
  /** Comma-separated list of unique related article DOIs for this milestone. */
  articlesDOI: string;
  createdDate: string | null;
  lastDate: string | null;
};

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
  'presenter-representation': PresenterRepresentationDataObject;
  'project-milestones': ProjectMilestonesDataObject;
};

export type MetricObject<T extends Metrics> = MetricToObjectMap[T];
