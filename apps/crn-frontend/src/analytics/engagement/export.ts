import {
  EngagementDataObject,
  EngagementPerformance,
  MeetingRepAttendanceResponse,
} from '@asap-hub/model';
import { utils } from '@asap-hub/react-components';
import { getPerformanceRanking } from '../utils/export';

export const engagementToCSV =
  (performance: EngagementPerformance) => (data: EngagementDataObject) => ({
    Team: data.name,
    'Team Status': data.inactiveSince ? 'Inactive' : 'Active',
    'Inactive Since': data.inactiveSince
      ? data.inactiveSince.split('T')[0]
      : '',
    Members: data.memberCount,
    'Events: Value': data.eventCount,
    'Events: Average': utils.getPerformanceText(
      data.eventCount,
      performance.events,
    ),
    'Total Speakers: Value': data.totalSpeakerCount,
    'Total Speakers: Average': utils.getPerformanceText(
      data.totalSpeakerCount,
      performance.totalSpeakers,
    ),
    'Unique Speakers (All Roles): Value': data.uniqueAllRolesCount,
    'Unique Speakers (All Roles): Percentage': `${data.uniqueAllRolesCountPercentage}%`,
    'Unique Speakers (All Roles): Average': utils.getPerformanceText(
      data.uniqueAllRolesCount,
      performance.uniqueAllRoles,
    ),
    'Unique Speakers (Key Personnel): Value': data.uniqueKeyPersonnelCount,
    'Unique Speakers (Key Personnel): Percentage': `${data.uniqueKeyPersonnelCountPercentage}%`,
    'Unique Speakers (Key Personnel): Average': utils.getPerformanceText(
      data.uniqueKeyPersonnelCount,
      performance.uniqueKeyPersonnel,
    ),
  });

export const meetingRepAttendanceToCSV = (
  data: MeetingRepAttendanceResponse,
) => ({
  'Team Name': data.teamName,
  'Team Status': data.isTeamInactive ? 'Inactive' : 'Active',
  Attendance:
    data.limitedData || data.attendancePercentage === null
      ? 'N/A'
      : `${data.attendancePercentage}%`,
  Ranking: getPerformanceRanking(data.attendancePercentage, data.limitedData),
});
