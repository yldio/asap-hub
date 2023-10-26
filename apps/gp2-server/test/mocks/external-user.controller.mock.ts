import ExternalUserController from '../../src/controllers/external-user.controller';

export const externalUserControllerMock = {
  fetch: jest.fn(),
} as unknown as jest.Mocked<ExternalUserController>;
