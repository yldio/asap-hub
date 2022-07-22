import { ExternalAuthorDataProvider } from '../../src/data-providers/external-authors.data-provider';

export const externalAuthorDataProviderMock: jest.Mocked<ExternalAuthorDataProvider> =
  {
    create: jest.fn(),
  };
