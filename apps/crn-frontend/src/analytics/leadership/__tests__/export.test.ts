import { Stringifier } from 'csv-stringify';
import { leadershipToCSV, algoliaResultsToStream } from '../export';

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

describe('algoliaResultsToStream', () => {
  const mockCsvStream = {
    write: jest.fn(),
    end: jest.fn(),
  };

  it('streams results', async () => {
    await algoliaResultsToStream(
      mockCsvStream as unknown as Stringifier,
      () =>
        Promise.resolve({
          total: 2,
          items: [
            {
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
            },
            {
              id: '2',
              displayName: 'Team 2',
              workingGroupLeadershipRoleCount: 2,
              workingGroupPreviousLeadershipRoleCount: 3,
              workingGroupMemberCount: 4,
              workingGroupPreviousMemberCount: 5,
              interestGroupLeadershipRoleCount: 4,
              interestGroupPreviousLeadershipRoleCount: 3,
              interestGroupMemberCount: 2,
              interestGroupPreviousMemberCount: 1,
            },
          ],
        }),
      (a) => a,
    );

    expect(mockCsvStream.write).toHaveBeenCalledTimes(2);

    expect(mockCsvStream.end).toHaveBeenCalledTimes(1);
  });

  it('handles undefined response', async () => {
    const transformSpy = jest.fn();
    await algoliaResultsToStream(
      mockCsvStream as unknown as Stringifier,
      () => Promise.resolve(undefined),
      transformSpy,
    );
    expect(transformSpy).not.toHaveBeenCalled();
  });
});
