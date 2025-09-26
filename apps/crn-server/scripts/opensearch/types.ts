import {
  MeetingRepAttendanceDataObject,
  OSChampionDataObject,
  PreliminaryDataSharingDataObject,
  PreprintComplianceDataObject,
  PublicationComplianceDataObject,
} from '@asap-hub/model';
import { validMetrics } from './constants';

export type Metrics = (typeof validMetrics)[number];

export type MetricToObjectMap = {
  'os-champion': OSChampionDataObject;
  'preliminary-data-sharing': PreliminaryDataSharingDataObject;
  attendance: MeetingRepAttendanceDataObject;
  'preprint-compliance': PreprintComplianceDataObject;
  'publication-compliance': PublicationComplianceDataObject;
};

export type MetricObject<T extends Metrics> = MetricToObjectMap[T];
