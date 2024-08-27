import { EngagementDataObject } from '@asap-hub/model';
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

  it('exports engagement data', () => {
    expect(engagementToCSV(data)).toEqual({
      Team: 'Test Team',
      'Team Status': 'Active',
      'Inactive Since': '',
      Members: 1,
      Events: 4,
      'Total Speakers': 3,
      'Unique Speakers (All Roles): Value': 3,
      'Unique Speakers (All Roles): Percentage': '100%',
      'Unique Speakers (Key Personnel): Value': 2,
      'Unique Speakers (Key Personnel): Percentage': '67%',
    });
  });
});
