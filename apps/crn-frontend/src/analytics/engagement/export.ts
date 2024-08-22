import { EngagementDataObject } from '@asap-hub/model';

export const engagementToCSV = (data: EngagementDataObject) => {
  return {
    Team: data.name,
    'Team Status': data.inactiveSince ? 'Inactive' : 'Active',
    'Inactive Since': data.inactiveSince
      ? data.inactiveSince.split('T')[0]
      : '',
    Members: data.memberCount,
    Events: data.eventCount,
    'Total Speakers': data.totalSpeakerCount,
    'Unique Speakers (All Roles): Value': data.uniqueAllRolesCount,
    'Unique Speakers (All Roles): Percentage': `${data.uniqueAllRolesCountPercentage}%`,
    'Unique Speakers (Key Personnel): Value': data.uniqueKeyPersonnelCount,
    'Unique Speakers (Key Personnel): Percentage': `${data.uniqueKeyPersonnelCountPercentage}%`,
  };
};
