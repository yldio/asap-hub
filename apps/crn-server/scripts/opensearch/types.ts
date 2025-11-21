import {
  MeetingRepAttendanceDataObject,
  OSChampionDataObject,
  PreliminaryDataSharingDataObject,
  PreprintComplianceDataObject,
  PublicationComplianceDataObject,
  TeamProductivityDataObject,
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
};

export type MetricObject<T extends Metrics> = MetricToObjectMap[T];
