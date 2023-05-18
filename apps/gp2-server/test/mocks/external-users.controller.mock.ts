import { ExternalUsersController } from '../../src/controllers/external-users.controller';

export const ExternalUsersControllerMock: jest.Mocked<ExternalUsersController> =
  {
    fetch: jest.fn(),
  };
