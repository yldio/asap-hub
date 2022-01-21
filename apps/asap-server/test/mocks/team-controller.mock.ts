import { TeamController } from '../../src/controllers/teams';

export const teamControllerMock: jest.Mocked<TeamController> = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
  update: jest.fn(),
  merge: jest.fn(),
};
