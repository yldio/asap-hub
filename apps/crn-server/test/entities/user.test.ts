import {
  GraphqlUserTeam,
  parseGraphQLUserTeamConnections,
  parseUserToDataObject,
  parseUserToResponse,
} from '../../src/entities/user';
import logger from '../../src/utils/logger';
import {
  fetchUserResponse,
  fetchUserResponseDataObject,
  getGraphQLUser,
} from '../fixtures/users.fixtures';

describe('User Entity', () => {
  describe('parseUserToDataObject', () => {
    test('user is parsed', () => {
      const user = fetchUserResponse();
      const userDataObject = parseUserToDataObject(user);
      expect(userDataObject).toEqual(fetchUserResponseDataObject());
    });
    test('empty teams is parsed', () => {
      const user = fetchUserResponse();
      user.data.teams.iv = null;
      const userDataObject = parseUserToDataObject(user);
      const expected = {
        ...fetchUserResponseDataObject(),
        teams: [],
      };
      expect(userDataObject).toEqual(expected);
    });
    test('parsing of labs', () => {
      const user = fetchUserResponse();
      user.data.labs.iv = [
        {
          id: 'labs/1',
          flatData: { name: 'lab1' },
        },
      ];
      const userDataObject = parseUserToDataObject(user);
      const expected = {
        ...fetchUserResponseDataObject(),
        labs: [{ id: 'labs/1', name: 'lab1' }],
      };
      expect(userDataObject).toEqual(expected);
    });
    test('parsing of labs with no name sets blank', () => {
      const user = fetchUserResponse();
      user.data.labs.iv = [
        {
          id: 'labs/1',
          flatData: {},
        },
      ];
      const userDataObject = parseUserToDataObject(user);
      const expected = {
        ...fetchUserResponseDataObject(),
        labs: [{ id: 'labs/1', name: '' }],
      };
      expect(userDataObject).toEqual(expected);
    });
  });
  describe('parseGraphQLUserTeamConnections', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test('should return an empty array if there are no teams', () => {
      const teams: GraphqlUserTeam[] = [];
      const parsedTeams = parseGraphQLUserTeamConnections(teams);
      expect(parsedTeams).toEqual([]);
    });
    test('should return an empty array if there are  teams are not defined', () => {
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
      expect(loggerWarnSpy).toHaveBeenCalledWith(
        `Team Connection is undefined`,
      );
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
  describe('parseUserToResponse', () => {
    test('adds display name', () => {
      const given = fetchUserResponseDataObject();
      const result = parseUserToResponse({
        ...given,
        lastName: 'last-name',
        firstName: 'first-name',
      });
      expect(result.displayName).toEqual('first-name last-name');
    });
    test('removes connection', () => {
      const given = fetchUserResponseDataObject();
      const result = parseUserToResponse({
        ...given,
        connections: [{ code: 'a connection' }],
      });
      expect((result as any).connections).not.toBeDefined();
    });
  });
});
