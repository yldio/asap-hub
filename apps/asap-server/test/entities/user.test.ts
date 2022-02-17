import {
  GraphqlUserTeam,
  parseGraphQLUserTeamConnections,
} from '../../src/entities/user';
import logger from '../../src/utils/logger';
import { getGraphQLUser } from '../fixtures/users.fixtures';

describe('parseGraphQLUserTeamConnections', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return an empty array if there are no teams', () => {
    const teams: GraphqlUserTeam[] = [];
    const parsedTeams = parseGraphQLUserTeamConnections(teams);
    expect(parsedTeams).toEqual([]);
  });

  test('should parse user team connections', () => {
    const teams: GraphqlUserTeam[] = getGraphQLUser().flatData.teams!;
    const parsedTeams = parseGraphQLUserTeamConnections(teams);
    expect(parsedTeams).toEqual([
      {
        displayName: 'Team A',
        id: 'team-id-1',
        proposal: 'proposalId1',
        role: 'Lead PI (Core Leadership)',
      },
    ]);
  });

  test('should filter out teams where id is null', () => {
    const teams: GraphqlUserTeam[] = getGraphQLUser().flatData.teams!;
    teams[0]!.id = null;
    const loggerWarnSpy = jest.spyOn(logger, 'warn');
    const parsedTeams = parseGraphQLUserTeamConnections(teams);
    expect(loggerWarnSpy).toHaveBeenCalledWith(`Team Connection is undefined`);
    expect(parsedTeams).toEqual([]);
  });

  test('should filter out teams when team role is invalid', () => {
    const teams: GraphqlUserTeam[] = getGraphQLUser().flatData.teams!;
    teams[0]!.role = 'invalid role';
    const loggerWarnSpy = jest.spyOn(logger, 'warn');
    const parsedTeams = parseGraphQLUserTeamConnections(teams);
    expect(loggerWarnSpy).toHaveBeenCalledWith(
      `Invalid team role: invalid role`,
    );
    expect(parsedTeams).toEqual([]);
  });
});
