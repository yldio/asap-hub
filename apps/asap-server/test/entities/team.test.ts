import {
  parseGraphQLTeam,
  parseGraphQLTeamMember,
} from '../../src/entities/team';
import { FetchTeamQuery } from '../../src/gql/graphql';
import {
  graphQlTeamsResponseSingle,
  referencingUsersContentsResponse,
} from '../fixtures/teams.fixtures';

describe('parseGraphQLTeamMember', () => {
  const teamMember = {
    ...referencingUsersContentsResponse({ avatar: null })[0]!,
  };
  it('should parse teamMember', () => {
    const parsedTeamMember = parseGraphQLTeamMember(teamMember, 'team-id-1');
    expect(parsedTeamMember).toEqual({
      id: 'user-id-1',
      firstName: 'Cristiano',
      lastName: 'Ronaldo',
      displayName: 'Cristiano Ronaldo',
      email: 'cristiano@ronaldo.com',
      role: 'Lead PI (Core Leadership)',
      labs: [
        { id: 'cd7be4902', name: 'Barcelona' },
        { id: 'cd7be4905', name: 'Glasgow' },
      ],
      avatarUrl: undefined,
    });
  });
  it('should throw when teamRole dont match TeamRoles', () => {
    const invalidTeamRole = {
      ...teamMember.flatData.teams![0]!,
      role: 'invalid role',
    };
    const teamMemberWithInvalidRole = {
      ...teamMember,
      flatData: {
        ...teamMember.flatData,
        teams: [invalidTeamRole],
      },
    };
    expect(() =>
      parseGraphQLTeamMember(teamMemberWithInvalidRole, 'team-id-1'),
    ).toThrow('Invalid team role on user user-id-1 : invalid role');
  });
  it('should throw when email is null', () => {
    const teamMemberWithMissingEmail = {
      ...teamMember,
      flatData: {
        ...teamMember.flatData,
        email: null,
      },
    };
    expect(() =>
      parseGraphQLTeamMember(teamMemberWithMissingEmail, 'team-id-1'),
    ).toThrow('Email is missing in user user-id-1');
  });
});
describe('parseGraphQLTeam', () => {
  const team = {
    ...graphQlTeamsResponseSingle.data.queryTeamsContentsWithTotal.items[0],
  };
  it('should throw when projectTitle is null', () => {
    const teamWithInvalidProjectTitle = {
      ...team,
      flatData: {
        ...team.flatData,
        projectTitle: null,
      },
    } as NonNullable<FetchTeamQuery['findTeamsContent']>;
    expect(() => parseGraphQLTeam(teamWithInvalidProjectTitle)).toThrow(
      'Project Title is missing in team team-id-1',
    );
  });
});
