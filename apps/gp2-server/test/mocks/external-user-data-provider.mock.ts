import { ExternalUserDataProvider } from '../../src/data-providers/types/external-user.data-provider.type';

export const externalUserDataProviderMock: jest.Mocked<ExternalUserDataProvider> =
  {
    create: jest.fn(),
    fetch: jest.fn(),
    fetchById: jest.fn(),
  };
