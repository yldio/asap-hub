import { OSChampionDataObject } from '@asap-hub/model';
import { leadershipToCSV, osChampionToCSV } from '../export';

describe('leadershipToCSV', () => {
  it('handles basic data', () => {
    const data = {
      id: '1',
      displayName: 'Team 1',
      workingGroupLeadershipRoleCount: 1,
      workingGroupPreviousLeadershipRoleCount: 2,
      workingGroupMemberCount: 3,
      workingGroupPreviousMemberCount: 4,
      interestGroupLeadershipRoleCount: 5,
      interestGroupPreviousLeadershipRoleCount: 6,
      interestGroupMemberCount: 7,
      interestGroupPreviousMemberCount: 8,
    };

    expect(leadershipToCSV('working-group')(data)).toEqual({
      Team: 'Team 1',
      'Team Status': 'Active',
      'Inactive Since': '',
      'Currently in a leadership role': '1',
      'Previously in a leadership role': '2',
      'Currently a member': '3',
      'Previously a member': '4',
    });
    expect(leadershipToCSV('interest-group')(data)).toEqual({
      Team: 'Team 1',
      'Team Status': 'Active',
      'Inactive Since': '',
      'Currently in a leadership role': '5',
      'Previously in a leadership role': '6',
      'Currently a member': '7',
      'Previously a member': '8',
    });
  });

  it('handles data with inactive team', () => {
    const data = {
      id: '1',
      displayName: 'Team 1',
      inactiveSince: '2022-09-30T09:00:00Z',
      workingGroupLeadershipRoleCount: 1,
      workingGroupPreviousLeadershipRoleCount: 2,
      workingGroupMemberCount: 3,
      workingGroupPreviousMemberCount: 4,
      interestGroupLeadershipRoleCount: 5,
      interestGroupPreviousLeadershipRoleCount: 6,
      interestGroupMemberCount: 7,
      interestGroupPreviousMemberCount: 8,
    };

    expect(leadershipToCSV('working-group')(data)).toEqual({
      Team: 'Team 1',
      'Team Status': 'Inactive',
      'Inactive Since': '2022-09-30',
      'Currently in a leadership role': '1',
      'Previously in a leadership role': '2',
      'Currently a member': '3',
      'Previously a member': '4',
    });
    expect(leadershipToCSV('interest-group')(data)).toEqual({
      Team: 'Team 1',
      'Team Status': 'Inactive',
      'Inactive Since': '2022-09-30',
      'Currently in a leadership role': '5',
      'Previously in a leadership role': '6',
      'Currently a member': '7',
      'Previously a member': '8',
    });
  });
});

describe('osChampionToCSV', () => {
  it('handles data with users', () => {
    const data = {
      teamId: '1',
      teamName: 'Team 1',
      isTeamInactive: false,
      teamAwardsCount: 8,
      timeRange: 'last-year',
      users: [
        { id: 'user1', name: 'User 1', awardsCount: 5 },
        { id: 'user2', name: 'User 2', awardsCount: 3 },
      ],
    } as OSChampionDataObject;

    expect(osChampionToCSV(data)).toEqual([
      {
        'Team Name': 'Team 1',
        'Team Status': 'Active',
        'User Name': 'User 1',
        'No.of Awards': '5',
      },
      {
        'Team Name': 'Team 1',
        'Team Status': 'Active',
        'User Name': 'User 2',
        'No.of Awards': '3',
      },
    ]);
  });

  it('handles data with inactive team', () => {
    const data = {
      teamId: '1',
      teamName: 'Team 1',
      isTeamInactive: true,
      teamAwardsCount: 2,
      timeRange: 'last-year' as const,
      users: [{ id: 'user1', name: 'User 1', awardsCount: 2 }],
    };

    expect(osChampionToCSV(data)).toEqual([
      {
        'Team Name': 'Team 1',
        'Team Status': 'Inactive',
        'User Name': 'User 1',
        'No.of Awards': '2',
      },
    ]);
  });

  it('handles data with no users', () => {
    const data = {
      teamId: '1',
      teamName: 'Team 1',
      isTeamInactive: false,
      teamAwardsCount: 0,
      timeRange: 'last-year' as const,
      users: [],
    };

    expect(osChampionToCSV(data)).toEqual([
      {
        'Team Name': 'Team 1',
        'Team Status': 'Active',
        'User Name': '',
        'No.of Awards': '0',
      },
    ]);
  });
});
