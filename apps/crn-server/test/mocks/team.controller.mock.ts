import TeamController from '../../src/controllers/team.controller';

export const teamControllerMock = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
  update: jest.fn(),
} as unknown as jest.Mocked<TeamController>;
