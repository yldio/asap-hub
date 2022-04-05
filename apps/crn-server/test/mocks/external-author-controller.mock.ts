import { ExternalAuthorsController } from '../../src/controllers/external-authors';

export const externalAuthorControllerMock: jest.Mocked<ExternalAuthorsController> =
  {
    fetch: jest.fn(),
    fetchById: jest.fn(),
    create: jest.fn(),
  };
