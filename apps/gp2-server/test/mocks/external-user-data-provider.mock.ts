import { ExternalUserDataProvider } from '../../src/data-providers/external-users.data-provider';

export const externalUserDataProviderMock: jest.Mocked<ExternalUserDataProvider> =
  {
    create: jest.fn(),
    fetch: jest.fn(),
  };
