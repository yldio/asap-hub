import {
  TeamProductivityDataObject,
  TeamProductivityPerformance,
  UserProductivityDataObject,
  UserProductivityPerformance,
} from '@asap-hub/model';
import { getPerformanceText } from '@asap-hub/react-components/src/utils';

export const userProductivityToCSV =
  (performance: UserProductivityPerformance) =>
  (data: UserProductivityDataObject) => ({
    user: data.name,
    status: data.isAlumni ? 'Alumni' : 'Active',
    teamA: data.teams[0]?.team || '',
    roleA: data.teams[0]?.role || '',
    teamB: data.teams[1]?.team || '',
    roleB: data.teams[1]?.role || '',
    ASAPOutputValue: data.asapOutput,
    ASAPOutputAverage: getPerformanceText(
      data.asapOutput,
      performance.asapOutput,
    ),
    ASAPPublicOutputValue: data.asapPublicOutput,
    ASAPPublicOutputAverage: getPerformanceText(
      data.asapPublicOutput,
      performance.asapPublicOutput,
    ),
    ratio: data.ratio,
  });

export const teamProductivityToCSV =
  (performance: TeamProductivityPerformance) =>
  (data: TeamProductivityDataObject) => ({
    team: data.name,
    status: data.isInactive ? 'Inactive' : 'Active',
    ASAPArticleOutputValue: data.Article,
    ASAPArticleOutputAverage: getPerformanceText(
      data.Article,
      performance.article,
    ),
    ASAPBioinformaticOutputValue: data.Bioinformatics,
    ASAPBioinformaticOutputAverage: getPerformanceText(
      data.Bioinformatics,
      performance.bioinformatics,
    ),
    ASAPDatasetOutputValue: data.Dataset,
    ASAPDatasetOutputAverage: getPerformanceText(
      data.Dataset,
      performance.dataset,
    ),
    ASAPALabResourceValue: data['Lab Resource'],
    ASAPALabResourceAverage: getPerformanceText(
      data['Lab Resource'],
      performance.labResource,
    ),
    ASAPProtocolValue: data.Protocol,
    ASAPProtocolAverage: getPerformanceText(
      data.Protocol,
      performance.protocol,
    ),
  });
