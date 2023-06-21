import ExternalAuthorController from '../../src/controllers/external-authors.controller';

export const externalAuthorControllerMock = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
} as unknown as jest.Mocked<ExternalAuthorController>;
