import { ExternalAuthorsController } from '../../src/controllers/external-authors.controller';

export const externalAuthorControllerMock: jest.Mocked<ExternalAuthorsController> =
  {
    fetch: jest.fn(),
    fetchById: jest.fn(),
  };
