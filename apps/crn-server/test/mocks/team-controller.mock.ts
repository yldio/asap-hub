import TeamController from '../../src/controllers/teams.controller';

export const teamControllerMock = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
  update: jest.fn(),
} as unknown as jest.Mocked<TeamController>;
