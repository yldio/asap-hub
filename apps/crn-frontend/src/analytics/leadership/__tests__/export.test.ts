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
      team: 'Team 1',
      currentlyInALeadershipRole: '1',
      previouslyInALeadershipRole: '2',
      currentlyAMember: '3',
      previouslyAMember: '4',
    });
    expect(leadershipToCSV('interest-group')(data)).toEqual({
      team: 'Team 1',
      currentlyInALeadershipRole: '5',
      previouslyInALeadershipRole: '6',
      currentlyAMember: '7',
      previouslyAMember: '8',
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
