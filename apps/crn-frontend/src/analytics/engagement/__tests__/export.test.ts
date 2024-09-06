import { EngagementDataObject, EngagementPerformance } from '@asap-hub/model';
import { engagementToCSV } from '../export';

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
      'Presentations: Average': 'Above',
      'Presentations: Value': 4,
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
});
