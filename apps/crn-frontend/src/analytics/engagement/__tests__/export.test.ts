import {
  EngagementDataObject,
  EngagementPerformance,
  MeetingRepAttendanceResponse,
} from '@asap-hub/model';
import { engagementToCSV, meetingRepAttendanceToCSV } from '../export';

describe('engagementToCSV', () => {
  const data: EngagementDataObject = {
    id: '1',
    name: 'Test Team',
    inactiveSince: null,
    memberCount: 1,
    eventCount: 4,
    totalSpeakerCount: 3,
    uniqueAllRolesCount: 3,
    uniqueAllRolesCountPercentage: 100,
    uniqueKeyPersonnelCount: 2,
    uniqueKeyPersonnelCountPercentage: 67,
  };
  const metric = {
    belowAverageMin: 1,
    belowAverageMax: 1,
    averageMin: 1,
    averageMax: 1,
    aboveAverageMin: 1,
    aboveAverageMax: 1,
  };

  const performance: EngagementPerformance = {
    events: metric,
    totalSpeakers: metric,
    uniqueAllRoles: metric,
    uniqueKeyPersonnel: metric,
  };

  it('exports engagement data', () => {
    expect(engagementToCSV(performance)(data)).toEqual({
      Team: 'Test Team',
      'Team Status': 'Active',
      'Inactive Since': '',
      Members: 1,
      'Events: Average': 'Above',
      'Events: Value': 4,
      'Total Speakers: Average': 'Above',
      'Total Speakers: Value': 3,
      'Unique Speakers (All Roles): Value': 3,
      'Unique Speakers (All Roles): Percentage': '100%',
      'Unique Speakers (All Roles): Average': 'Above',
      'Unique Speakers (Key Personnel): Value': 2,
      'Unique Speakers (Key Personnel): Percentage': '67%',
      'Unique Speakers (Key Personnel): Average': 'Above',
    });
  });
  it('handles inactiveSince', () => {
    expect(
      engagementToCSV(performance)({ ...data, inactiveSince: 'dateT000' }),
    ).toEqual(
      expect.objectContaining({
        'Inactive Since': 'date',
      }),
    );
  });
});

describe('meetingRepAttendanceToCSV', () => {
  it('exports meeting rep attendance data for active team with full data', () => {
    const data: MeetingRepAttendanceResponse = {
      teamId: 'team-1',
      teamName: 'Test Team',
      isTeamInactive: false,
      attendancePercentage: 85,
      limitedData: false,
      timeRange: 'all',
    };

    expect(meetingRepAttendanceToCSV(data)).toEqual({
      'Team Name': 'Test Team',
      'Team Status': 'Active',
      Attendance: '85%',
      Ranking: 'Adequate',
    });
  });

  it('exports meeting rep attendance data for inactive team with full data', () => {
    const data: MeetingRepAttendanceResponse = {
      teamId: 'team-2',
      teamName: 'Inactive Team',
      isTeamInactive: true,
      attendancePercentage: 95,
      limitedData: false,
      timeRange: 'all',
    };

    expect(meetingRepAttendanceToCSV(data)).toEqual({
      'Team Name': 'Inactive Team',
      'Team Status': 'Inactive',
      Attendance: '95%',
      Ranking: 'Outstanding',
    });
  });

  it('exports meeting rep attendance data with limited data', () => {
    const data: MeetingRepAttendanceResponse = {
      teamId: 'team-3',
      teamName: 'Limited Data Team',
      isTeamInactive: false,
      attendancePercentage: null,
      limitedData: true,
      timeRange: 'all',
    };

    expect(meetingRepAttendanceToCSV(data)).toEqual({
      'Team Name': 'Limited Data Team',
      'Team Status': 'Active',
      Attendance: 'N/A',
      Ranking: 'Limited Data',
    });
  });

  it('exports meeting rep attendance data with null percentage', () => {
    const data: MeetingRepAttendanceResponse = {
      teamId: 'team-4',
      teamName: 'Null Percentage Team',
      isTeamInactive: false,
      attendancePercentage: null,
      limitedData: false,
      timeRange: 'all',
    };

    expect(meetingRepAttendanceToCSV(data)).toEqual({
      'Team Name': 'Null Percentage Team',
      'Team Status': 'Active',
      Attendance: 'N/A',
      Ranking: 'Limited Data',
    });
  });

  it.each`
    attendancePercentage | expectedRanking
    ${100}               | ${'Outstanding'}
    ${95}                | ${'Outstanding'}
    ${90}                | ${'Outstanding'}
    ${89}                | ${'Adequate'}
    ${85}                | ${'Adequate'}
    ${80}                | ${'Adequate'}
    ${79}                | ${'Needs Improvement'}
    ${50}                | ${'Needs Improvement'}
    ${0}                 | ${'Needs Improvement'}
  `(
    'exports correct ranking for $attendancePercentage% shared data',
    ({ attendancePercentage, expectedRanking }) => {
      const data: MeetingRepAttendanceResponse = {
        teamId: 'team-5',
        teamName: 'Test Team',
        isTeamInactive: false,
        attendancePercentage,
        limitedData: false,
        timeRange: 'all',
      };

      expect(meetingRepAttendanceToCSV(data)).toEqual({
        'Team Name': 'Test Team',
        'Team Status': 'Active',
        Attendance: `${attendancePercentage}%`,
        Ranking: expectedRanking,
      });
    },
  );
});
