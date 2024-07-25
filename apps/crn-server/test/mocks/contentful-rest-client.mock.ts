import { Environment } from '@asap-hub/contentful';

export const getContentfulEnvironmentMock = (
  overrideProps: Partial<Environment> = {},
): jest.Mocked<Environment> =>
  ({
    ...overrideProps,
    getEntry: jest.fn(),
    getAsset: jest.fn(),
    createEntry: jest.fn(),
    createAssetFromFiles: jest.fn(),
  }) as unknown as jest.Mocked<Environment>;
