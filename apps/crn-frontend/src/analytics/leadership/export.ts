import { CSVValue } from '@asap-hub/frontend-utils';
import { AnalyticsTeamLeadershipDataObject } from '@asap-hub/model';

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
