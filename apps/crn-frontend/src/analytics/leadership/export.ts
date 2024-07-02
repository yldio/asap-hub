import { CSVValue, GetListOptions } from '@asap-hub/frontend-utils';
import {
  AnalyticsTeamLeadershipDataObject,
  ListResponse,
} from '@asap-hub/model';
import { Stringifier } from 'csv-stringify/browser/esm';

type LeadershipRowCSV = Record<string, CSVValue>;

export const leadershipToCSV =
  (metric: 'working-group' | 'interest-group') =>
  (data: AnalyticsTeamLeadershipDataObject): LeadershipRowCSV => {
    const metricPrefix =
      metric === 'working-group' ? 'workingGroup' : 'interestGroup';
    return {
      Team: data.displayName,
      'Team Status': data.inactiveSince ? 'Inactive' : 'Active',
      'Inactive Since': data.inactiveSince
        ? data.inactiveSince.split('T')[0]
        : '',
      'Currently in a leadership role':
        data[`${metricPrefix}LeadershipRoleCount`].toString(),
      'Previously in a leadership role':
        data[`${metricPrefix}PreviousLeadershipRoleCount`].toString(),
      'Currently a member': data[`${metricPrefix}MemberCount`].toString(),
      'Previously a member':
        data[`${metricPrefix}PreviousMemberCount`].toString(),
    };
  };

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
