import { InterestGroupController } from '../../src/controllers/interest-groups';

export const interestGroupControllerMock: jest.Mocked<InterestGroupController> =
  {
    fetch: jest.fn(),
    fetchById: jest.fn(),
    fetchByTeamId: jest.fn(),
    fetchByUserId: jest.fn(),
  };
