import { cleanArray } from '@asap-hub/server-common';
import {
  getCurrentWorkingGroupIdsFromTeamLeaders,
  getPreviousWorkingGroupIdsFromTeamLeaders,
  getTeamLeadershipItem,
  Team,
  User,
} from '../../../src/utils/analytics/leadership';

const makeTestTeam = (
  items: NonNullable<
    NonNullable<
      NonNullable<
        NonNullable<
          NonNullable<Team['linkedFrom']>['teamMembershipCollection']
        >['items'][number]
      >['linkedFrom']
    >['usersCollection']
  >['items'],
  id = 'team-id',
): Team => ({
  sys: {
    id,
  },
  linkedFrom: {
    teamMembershipCollection: {
      items: [
        {
          inactiveSinceDate: null,
          linkedFrom: { usersCollection: { items: items } },
        },
      ],
    },
  },
});
const makeLeader = (groupId: string, active = true, role = 'Chair'): User => ({
  alumniSinceDate: undefined,
  linkedFrom: {
    workingGroupLeadersCollection: {
      items: [
        {
          role,
          linkedFrom: {
            workingGroupsCollection: {
              items: [{ sys: { id: groupId }, complete: !active }],
            },
          },
        },
      ],
    },
    interestGroupLeadersCollection: {
      items: [
        {
          linkedFrom: {
            interestGroupsCollection: {
              items: [{ sys: { id: groupId }, active }],
            },
          },
        },
      ],
    },
  },
});

const makeMember = (groupId: string, active = true): User => ({
  alumniSinceDate: undefined,
  linkedFrom: {
    workingGroupMembersCollection: {
      items: [
        {
          linkedFrom: {
            workingGroupsCollection: {
              items: [{ sys: { id: groupId }, complete: !active }],
            },
          },
        },
      ],
    },
  },
});

describe('getPreviousWorkingGroupIdsFromTeamLeaders', () => {
  it('counts inactive leaders', () => {
    const team = makeTestTeam([makeLeader('A', false)]);
    const result = getPreviousWorkingGroupIdsFromTeamLeaders(team);
    expect(result).toEqual(['A']);
  });
  it('skip active leaders', () => {
    const team = makeTestTeam([makeLeader('A', true)]);
    const result = getPreviousWorkingGroupIdsFromTeamLeaders(team);
    expect(result).toEqual([]);
  });
});

describe('getCurrentWorkingGroupIdsFromTeamLeaders', () => {
  it('counts active leaders', () => {
    const team = makeTestTeam([makeLeader('A', true)]);
    const result = getCurrentWorkingGroupIdsFromTeamLeaders(team);
    expect(result).toEqual(['A']);
  });
  it('skip inactive leaders', () => {
    const team = makeTestTeam([makeLeader('A', false)]);
    const result = getCurrentWorkingGroupIdsFromTeamLeaders(team);
    expect(result).toEqual([]);
  });
});

describe('getTeamLeadershipItem', () => {
  describe('Project Manager role', () => {
    it('counts current PM in memberships but not leadership', () => {
      const team = makeTestTeam([makeLeader('A', true, 'Project Manager')]);
      const result = getTeamLeadershipItem(team);
      expect(result.workingGroupLeadershipRoleCount).toBe(0);
      expect(result.workingGroupMemberCount).toBe(1);
    });

    it('counts previous PM in memberships but not leadership', () => {
      const team = makeTestTeam([makeLeader('A', false, 'Project Manager')]);
      const result = getTeamLeadershipItem(team);
      expect(result.workingGroupPreviousLeadershipRoleCount).toBe(0);
      expect(result.workingGroupPreviousMemberCount).toBe(1);
    });

    it.each`
      activeLead | pastLead | activePM | pastPM | activeLeadCount | pastLeadCount | activeMemberCount | pastMemberCount
      ${0}       | ${0}     | ${0}     | ${0}   | ${0}            | ${0}          | ${0}              | ${0}
      ${0}       | ${1}     | ${0}     | ${1}   | ${0}            | ${1}          | ${0}              | ${1}
      ${0}       | ${0}     | ${1}     | ${0}   | ${0}            | ${0}          | ${1}              | ${0}
      ${0}       | ${0}     | ${1}     | ${1}   | ${0}            | ${0}          | ${1}              | ${0}
      ${1}       | ${1}     | ${1}     | ${1}   | ${1}            | ${0}          | ${1}              | ${0}
      ${0}       | ${1}     | ${1}     | ${1}   | ${0}            | ${1}          | ${1}              | ${0}
    `(
      `gives the proper lead counts for "activeLead: $activeLead, pastLead: $pastLead, activePM: $activePM, pastPM: $pastPM"`,
      ({
        activeLead,
        pastLead,
        activePM,
        pastPM,
        activeLeadCount,
        pastLeadCount,
        activeMemberCount,
        pastMemberCount,
      }) => {
        const team = makeTestTeam(
          cleanArray([
            activeLead ? makeLeader('A', true) : null,
            pastLead ? makeLeader('A', false) : null,
            activePM ? makeLeader('A', true, 'Project Manager') : null,
            pastPM ? makeLeader('A', false, 'Project Manager') : null,
          ]),
        );
        const result = getTeamLeadershipItem(team);
        expect(result.workingGroupLeadershipRoleCount).toBe(activeLeadCount);
        expect(result.workingGroupPreviousLeadershipRoleCount).toBe(
          pastLeadCount,
        );

        expect(result.workingGroupMemberCount).toBe(activeMemberCount);
        expect(result.workingGroupPreviousMemberCount).toBe(pastMemberCount);
      },
    );
  });

  it.each`
    activeLeadA | pastLeadA | activeLeadB | pastLeadB | activeLeadCount | pastLeadCount
    ${0}        | ${0}      | ${0}        | ${0}      | ${0}            | ${0}
    ${1}        | ${1}      | ${0}        | ${0}      | ${1}            | ${0}
    ${1}        | ${0}      | ${0}        | ${0}      | ${1}            | ${0}
    ${1}        | ${1}      | ${1}        | ${1}      | ${2}            | ${0}
    ${0}        | ${1}      | ${0}        | ${1}      | ${0}            | ${2}
    ${0}        | ${1}      | ${1}        | ${1}      | ${1}            | ${1}
  `(
    `gives the proper lead counts for "activeLeadA: $activeLeadA, pastLeadA: $pastLeadA, activeLeadB: $activeLeadB, pastLeadB: $pastLeadB"`,
    ({
      activeLeadA,
      pastLeadA,
      activeLeadB,
      pastLeadB,
      activeLeadCount,
      pastLeadCount,
    }) => {
      const team = makeTestTeam(
        cleanArray([
          activeLeadA ? makeLeader('A', true) : null,
          pastLeadA ? makeLeader('A', false) : null,
          activeLeadB ? makeLeader('B', true) : null,
          pastLeadB ? makeLeader('B', false) : null,
        ]),
      );
      const result = getTeamLeadershipItem(team);
      expect(result.workingGroupLeadershipRoleCount).toBe(activeLeadCount);
      expect(result.workingGroupPreviousLeadershipRoleCount).toBe(
        pastLeadCount,
      );

      expect(result.interestGroupLeadershipRoleCount).toBe(activeLeadCount);
      expect(result.interestGroupPreviousLeadershipRoleCount).toBe(
        pastLeadCount,
      );
    },
  );

  it.each`
    activeMemberA | pastMemberA | activeMemberB | pastMemberB | activeMemberCount | pastMemberCount
    ${0}          | ${0}        | ${0}          | ${0}        | ${0}              | ${0}
    ${1}          | ${1}        | ${0}          | ${0}        | ${1}              | ${0}
    ${1}          | ${0}        | ${0}          | ${0}        | ${1}              | ${0}
    ${1}          | ${1}        | ${1}          | ${1}        | ${2}              | ${0}
    ${0}          | ${1}        | ${0}          | ${1}        | ${0}              | ${2}
    ${0}          | ${1}        | ${1}          | ${1}        | ${1}              | ${1}
  `(
    `gives the proper membership counts for "activeMemberA: $activeMemberA, pastMemberA: $pastMemberA, activeMemberB: $activeMemberB, pastMemberB: $pastMemberB"`,
    ({
      activeMemberA,
      pastMemberA,
      activeMemberB,
      pastMemberB,
      activeMemberCount,
      pastMemberCount,
    }) => {
      const team = makeTestTeam(
        cleanArray([
          activeMemberA ? makeMember('A', true) : null,
          pastMemberA ? makeMember('A', false) : null,
          activeMemberB ? makeMember('B', true) : null,
          pastMemberB ? makeMember('B', false) : null,
        ]),
      );
      const result = getTeamLeadershipItem(team);
      expect(result.workingGroupMemberCount).toBe(activeMemberCount);
      expect(result.workingGroupPreviousMemberCount).toBe(pastMemberCount);
    },
  );
});
