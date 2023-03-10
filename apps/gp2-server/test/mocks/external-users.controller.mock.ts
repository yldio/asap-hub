import { ExternalUsersController } from '../../src/controllers/external-users.controller';

export const ExternalusersControllerMock: jest.Mocked<ExternalUsersController> =
  {
    fetch: jest.fn(),
  };
