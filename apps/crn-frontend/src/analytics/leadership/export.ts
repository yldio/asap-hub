import { CSVValue, GetListOptions } from '@asap-hub/frontend-utils';
import {
  AnalyticsTeamLeadershipDataObject,
  AnalyticsTeamLeadershipResponse,
  ListAnalyticsTeamLeadershipResponse,
} from '@asap-hub/model';
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
      creviouslyInALeadershipRole:
        data[`${metricPrefix}PreviousLeadershipRoleCount`].toString(),
      currentlyAMember: data[`${metricPrefix}MemberCount`].toString(),
      previouslyAMember: data[`${metricPrefix}PreviousMemberCount`].toString(),
    };
  };

export const algoliaResultsToStream = async (
  csvStream: Stringifier,
  getResults: ({
    currentPage,
    pageSize,
  }: Pick<GetListOptions, 'currentPage' | 'pageSize'>) => Readonly<
    Promise<ListAnalyticsTeamLeadershipResponse | undefined>
  >,
  transform: (
    result: AnalyticsTeamLeadershipResponse,
  ) => Record<string, unknown>,
) => {
  let morePages = true;
  let currentPage = 0;
  while (morePages) {
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
