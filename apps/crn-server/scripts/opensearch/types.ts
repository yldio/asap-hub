import {
  MeetingRepAttendanceDataObject,
  OSChampionDataObject,
  PreliminaryDataSharingDataObject,
  PreprintComplianceDataObject,
  PublicationComplianceDataObject,
  TeamProductivityDataObject,
  UserCollaborationDataObject,
  UserProductivityDataObject,
} from '@asap-hub/model';
import { validMetrics } from './constants';

export type Metrics = (typeof validMetrics)[number];

export type MetricToObjectMap = {
  'os-champion': OSChampionDataObject;
  'preliminary-data-sharing': PreliminaryDataSharingDataObject;
  attendance: MeetingRepAttendanceDataObject;
  'preprint-compliance': PreprintComplianceDataObject;
  'publication-compliance': PublicationComplianceDataObject;
  'user-productivity': UserProductivityDataObject;
  'team-productivity': TeamProductivityDataObject;
  'user-collaboration': UserCollaborationDataObject;
};

export type MetricObject<T extends Metrics> = MetricToObjectMap[T];
