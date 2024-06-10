import { CSVValue, GetListOptions } from '@asap-hub/frontend-utils';
import {
  AnalyticsTeamLeadershipDataObject,
  ListResponse,
  TeamProductivityDataObject,
  TeamProductivityPerformance,
  UserProductivityDataObject,
  UserProductivityPerformance,
} from '@asap-hub/model';
import { getPerformanceText } from '@asap-hub/react-components/src/utils';
import { Stringifier } from 'csv-stringify/browser/esm';

type LeadershipRowCSV = Record<string, CSVValue>;

export const leadershipToCSV =
  (metric: 'working-group' | 'interest-group') =>
  (data: AnalyticsTeamLeadershipDataObject): LeadershipRowCSV => {
    const metricPrefix =
      metric === 'working-group' ? 'workingGroup' : 'interestGroup';
    return {
      team: data.displayName,
      currentlyInALeadershipRole:
        data[`${metricPrefix}LeadershipRoleCount`].toString(),
      previouslyInALeadershipRole:
        data[`${metricPrefix}PreviousLeadershipRoleCount`].toString(),
      currentlyAMember: data[`${metricPrefix}MemberCount`].toString(),
      previouslyAMember: data[`${metricPrefix}PreviousMemberCount`].toString(),
    };
  };

export const userProductivityToCSV =
  (performance: UserProductivityPerformance) =>
  (data: UserProductivityDataObject) => ({
    user: data.name,
    status: data.isAlumni ? 'Alumni' : 'Active',
    teamA: data.teams[0]?.team,
    roleA: data.teams[0]?.role,
    teamB: data.teams[1]?.team,
    roleB: data.teams[1]?.role,
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

export const algoliaResultsToStream = async <T>(
  csvStream: Stringifier,
  getResults: ({
    currentPage,
    pageSize,
  }: Pick<GetListOptions, 'currentPage' | 'pageSize'>) => Readonly<
    Promise<ListResponse<T> | undefined>
  >,
  transform: (result: T) => Record<string, unknown>,
) => {
  let morePages = true;
  let currentPage = 0;
  while (morePages) {
    // eslint-disable-next-line no-await-in-loop
    const data = await getResults({
      currentPage,
      pageSize: 10,
    });
    if (data) {
      const nbPages = data.total / 10;
      data.items.map(transform).forEach((row) => csvStream.write(row));
      currentPage += 1;
      morePages = currentPage <= nbPages;
    } else {
      morePages = false;
    }
  }
  csvStream.end();
};
