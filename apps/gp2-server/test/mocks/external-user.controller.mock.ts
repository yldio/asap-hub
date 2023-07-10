import ExternalUserController from '../../src/controllers/external-user.controller';

export const ExternalUserControllerMock = {
  fetch: jest.fn(),
} as unknown as jest.Mocked<ExternalUserController>;
