import { CSVValue } from '@asap-hub/frontend-utils';
import {
  AnalyticsTeamLeadershipDataObject,
  OSChampionDataObject,
} from '@asap-hub/model';

type LeadershipRowCSV = Record<string, CSVValue>;

export const leadershipToCSV =
  (metric: 'working-group' | 'interest-group' | 'os-champion') =>
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

export const osChampionToCSV = (
  data: OSChampionDataObject,
): LeadershipRowCSV[] => {
  const userRows: LeadershipRowCSV[] = [];

  // If there are users, create a row for each user
  if (data.users && data.users.length > 0) {
    data.users.forEach((user) => {
      userRows.push({
        'Team Name': data.teamName,
        'Team Status': data.isTeamInactive ? 'Inactive' : 'Active',
        'User Name': user.name,
        'No.of Awards': user.awardsCount.toString(),
      });
    });
  } else {
    // If no users, create a placeholder entry
    userRows.push({
      'Team Name': data.teamName,
      'Team Status': data.isTeamInactive ? 'Inactive' : 'Active',
      'User Name': '',
      'No.of Awards': '0',
    });
  }

  return userRows;
};
